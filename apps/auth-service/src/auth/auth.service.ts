import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import {
  AuthTokens,
  IAuthResponse,
  JwtPayload,
} from './interfaces/auth.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { UserBasic } from 'src/user/interfaces/user-basic.interface';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_EXPIRATION_DAYS = 7;
  private readonly HASH_SALT_ROUNDS = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private async getTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.REFRESH_TOKEN_EXPIRATION_DAYS}d`,
    });

    const expiresAt = new Date(
      Date.now() + this.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
    );

    const tokenHash = await bcrypt.hash(refreshToken, this.HASH_SALT_ROUNDS);

    const newRefreshTokenEntity = this.refreshTokenRepository.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    await this.refreshTokenRepository.save(newRefreshTokenEntity);

    return { accessToken, refreshToken };
  }

  async register(userData: RegisterUserDto) {
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'Email já registrado.',
      });
    }

    const user = await this.userService.create(userData);
    const tokens = await this.getTokens(user);

    const { password, ...result } = user;
    return { ...result, ...tokens };
  }

  async login(loginDto: LoginUserDto): Promise<IAuthResponse> {
    const userWithPassword = await this.userService.findByEmail(loginDto.email);

    if (
      !userWithPassword ||
      !(await bcrypt.compare(loginDto.password, userWithPassword.password))
    ) {
      throw new RpcException({
        statusCode: 401,
        message: 'Credenciais inválidas.',
      });
    }

    await this.refreshTokenRepository.update(
      { userId: userWithPassword.id, isRevoked: false },
      { isRevoked: true },
    );

    const tokens = await this.getTokens(userWithPassword);
    const { password, createdAt, ...userWithoutPassword } = userWithPassword;
    return { ...tokens, ...userWithoutPassword };
  }

  async refreshAccessToken(oldRefreshToken: string): Promise<AuthTokens> {
    if (!oldRefreshToken) {
      throw new RpcException({
        statusCode: 400,
        message: 'Refresh token não fornecido.',
      });
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(oldRefreshToken);
    } catch (e) {
      throw new RpcException({
        statusCode: 401,
        message: 'Refresh token inválido ou expirado.',
      });
    }

    const user = await this.userService.findById(payload.sub);

    const allUserTokens = await this.refreshTokenRepository.find({
      where: { userId: user.id, isRevoked: false },
    });

    let matchedTokenEntity: RefreshToken | undefined = undefined;

    for (const tokenEntity of allUserTokens) {
      if (await bcrypt.compare(oldRefreshToken, tokenEntity.tokenHash)) {
        matchedTokenEntity = tokenEntity;
        break;
      }
    }

    if (!matchedTokenEntity || matchedTokenEntity.expiresAt < new Date()) {
      throw new RpcException({
        statusCode: 401,
        message: 'Token de sessão não encontrado ou expirado.',
      });
    }

    await this.refreshTokenRepository.update(matchedTokenEntity.id, {
      isRevoked: true,
    });

    const tokens = await this.getTokens(user);

    return tokens;
  }

  async getAllUsers(): Promise<UserBasic[]> {
    const users = await this.userService.findAllBasic();
    return users;
  }
}
