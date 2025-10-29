import { Module } from '@nestjs/common';
import { TasksController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [AppService],
})
export class AppModule {}
