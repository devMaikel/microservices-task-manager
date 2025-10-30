import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  async handleRegisterUser(data: RegisterUserDto) {
    this.logger.log(`Recebendo comando 'register_user' para: ${data.email}`);
    const newUser = await this.authService.register(data);
    return newUser;
  }

  @MessagePattern({ cmd: 'login_user' })
  async handleLoginUser(data: LoginUserDto) {
    this.logger.log(`Recebendo comando 'login_user' para: ${data.email}`);
    const result = await this.authService.login(data);
    return result;
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async handleRefreshToken(data: { refreshToken: string }) {
    this.logger.log(`Recebendo comando 'refresh_token'`);
    // Maikel implementar o método no AuthService em breve:
    // return this.authService.refreshToken(data.refreshToken);
    return this.authService.refreshAccessToken(data.refreshToken);
  }
}
