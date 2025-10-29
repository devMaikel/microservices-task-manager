import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Cadastro de um novo usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Requisição de cadastro de usuário aceita.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post('register')
  async registerUser(@Body() newUserData: RegisterUserDto) {
    const payload = { ...newUserData };
    return this.clientProxy.send({ cmd: 'register_user' }, payload);
  }

  @ApiOperation({ summary: 'Login de usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Requisição de login aceita.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post('login')
  async loginUser(@Body() loginUserData: LoginUserDto) {
    const payload = { ...loginUserData, timestamp: new Date() };
    return this.clientProxy.send({ cmd: 'login_user' }, payload);
  }

  @ApiOperation({ summary: 'Login de usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Requisição de login aceita.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post('refresh')
  async createTask(@Body() refreshToken: RefreshTokenDto) {
    const payload = { ...refreshToken, timestamp: new Date() };
    return this.clientProxy.send({ cmd: 'refresh_token' }, payload);
  }
}
