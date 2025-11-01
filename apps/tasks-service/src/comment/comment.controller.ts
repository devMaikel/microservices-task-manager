import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { CreateCommentPayload } from './dto/create-comment.payload';
import { ListCommentsPayload } from './interfaces/task.interfaces';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern({ cmd: 'create_comment' })
  async handleCreateComment(@Payload() payload: CreateCommentPayload) {
    console.log(
      `[TaskController] Recebendo comando 'create_comment' para Task ID ${payload.taskId}`,
    );
    return this.commentService.createComment(payload);
  }

  @MessagePattern({ cmd: 'list_task_comments' })
  async handleListComments(@Payload() payload: ListCommentsPayload) {
    console.log(
      `[CommentController] Recebendo comando 'list_task_comments' para Task ID ${payload.taskId}`,
    );
    return this.commentService.listCommentsByTask(payload);
  }

}
