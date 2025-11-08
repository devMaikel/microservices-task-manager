import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentPayload } from './dto/create-comment.payload';
import { RpcException } from '@nestjs/microservices';
import { Task } from 'src/task/entities/task.entity';
import {
  ListCommentsPayload,
  PaginatedComments,
} from './interfaces/task.interfaces';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private dataSource: DataSource,
  ) {}

  async createComment(payload: CreateCommentPayload): Promise<Comment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { taskId, userId, content } = payload;

      const task = await queryRunner.manager.findOne(Task, {
        where: { id: taskId },
      });
      if (!task) {
        throw new RpcException({
          statusCode: 404,
          message: `Task with ID ${taskId} not found.`,
        });
      }

      // Verifica se o usuário está atribuído à tarefa
      const isAssigned =
        Array.isArray(task.assignedUserIds) &&
        task.assignedUserIds.includes(userId);

      if (!isAssigned && task.creatorId !== userId) {
        throw new RpcException({
          statusCode: 403,
          message: `User is not assigned to task.`,
        });
      }

      const comment = this.commentRepository.create({
        taskId,
        userId,
        content,
      });
      const savedComment = await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();

      // this.rabbitClient.emit('task.comment.created', {
      //   taskId: taskId,
      //   commentId: savedComment.id,
      //   userId: userId,
      //   content: content,
      // });

      return savedComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        statusCode: 500,
        message: `Failed to create comment: ${error.message}`,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async listCommentsByTask(
    payload: ListCommentsPayload,
  ): Promise<PaginatedComments> {
    const { taskId, page = 1, size = 10 } = payload;
    const skip = (page - 1) * size;

    const taskExists = await this.dataSource.manager.findOne(Task, {
      where: { id: taskId },
    });
    if (!taskExists) {
      throw new RpcException({
        statusCode: 404,
        message: `Task with ID ${taskId} not found.`,
      });
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { taskId: taskId },
      relations: ['author'],
      take: size,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    return {
      data: comments,
      total: total,
      page: page,
      size: size,
    };
  }
}
