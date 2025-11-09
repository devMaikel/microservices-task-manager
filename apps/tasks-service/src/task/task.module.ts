import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { TaskService } from './task.service';
import { TaskHistory } from 'src/task/entities/task-history.entity';
import { TaskController } from './task.controller';
import { Comment } from 'src/comment/entities/comment.entity';
import { CommentModule } from 'src/comment/comment.module';
import { Task } from './entities/task.entity';
import { EventsPublisherService } from '../events/publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskHistory, Comment]),
    DatabaseModule,
    CommentModule
  ],
  controllers: [TaskController],
  providers: [TaskService, EventsPublisherService],
  exports: [TaskService],
})
export class TaskModule {}
