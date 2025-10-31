import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskHistory } from 'src/history/task-history.entity';
import { TaskController } from './task.controller';
import { Comment } from 'src/comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskHistory, Comment]),
    DatabaseModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
