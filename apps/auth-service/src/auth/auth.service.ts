import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já registrado.');
    }

    const user = await this.userService.create(registerDto);

    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const userWithPassword = await this.userService.findByEmail(loginDto.email);

    if (!userWithPassword) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userWithPassword.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { 
        email: userWithPassword.email, 
        sub: userWithPassword.id 
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}