import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'register_user' })
  async handleRegisterUser(data: any) {
    this.logger.log(`Received new task register_user: ${JSON.stringify(data)}`);
    return { success: true, registerId: 123, receivedData: data };
  }

  @MessagePattern({ cmd: 'login_user' })
  async handleLoginUser(data: any) {
    this.logger.log(`Received new task login_user: ${JSON.stringify(data)}`);
    return { success: true, loginId: 123, receivedData: data };
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async handleRefreshToken(data: any) {
    this.logger.log(`Received new task refresh_token: ${JSON.stringify(data)}`);
    return { success: true, refreshId: 123, receivedData: data };
  }
}
