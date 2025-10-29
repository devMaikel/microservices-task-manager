import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TasksController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(TasksController.name);

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'create_task' })
  async handleTaskCreated(data: any) {
    this.logger.log(
      `Received new task creation requestt: ${JSON.stringify(data)}`,
    );
    return { success: true, taskId: 123, receivedData: data };
  }
}
