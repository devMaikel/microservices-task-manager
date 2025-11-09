import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { EventsPublisherService } from '../events/publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    DatabaseModule
  ],
  controllers: [CommentController],
  providers: [CommentService, EventsPublisherService],
  exports: [CommentService],
})
export class CommentModule {}