import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Cadastro de um novo usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail já registrado.' })
  @Post('register')
  async registerUser(@Body() newUserData: RegisterUserDto) {
    const payload = { ...newUserData };
    return this.authClient.send({ cmd: 'register_user' }, payload);
  }

  @ApiOperation({ summary: 'Login de usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @Post('login')
  async loginUser(@Body() loginUserData: LoginUserDto) {
    const payload = { ...loginUserData, timestamp: new Date() };
    return this.authClient.send({ cmd: 'login_user' }, payload);
  }

  @ApiOperation({
    summary: 'Gera um novo access token usando o refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Novo token de acesso gerado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Refresh token não fornecido.' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado.',
  })
  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async createTask(@Body() refreshToken: RefreshTokenDto) {
    const payload = { ...refreshToken, timestamp: new Date() };
    return this.authClient.send({ cmd: 'refresh_token' }, payload);
  }
}
