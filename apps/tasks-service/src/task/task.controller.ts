import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateTaskPayload } from './dto/update-task.payload';
import { CreateCommentPayload } from './dto/create-comment.payload';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'list_tasks' })
  async handleListTasks(@Payload() pagination: PaginationDto) {
    console.log(
      `[TaskController] Recebendo comando 'list_tasks' para página ${pagination.page}`,
    );
    return this.taskService.getTasks(pagination);
  }

  @MessagePattern({ cmd: 'get_task_by_id' })
  async handleGetTaskById(@Payload() id: string) {
    console.log(
      `[TaskController] Recebendo comando 'get_task_by_id' para ID ${id}`,
    );
    return this.taskService.getTaskById(id);
  }

  @MessagePattern({ cmd: 'create_task' })
  async handleCreateTask(@Payload() createTaskDto: CreateTaskDto) {
    console.log(
      `[TaskController] Recebendo comando 'create_task' para "${createTaskDto.title}"`,
    );
    return this.taskService.createTask(createTaskDto);
  }

  @MessagePattern({ cmd: 'update_task' })
  async handleUpdateTask(@Payload() payload: UpdateTaskPayload) {
    console.log(
      `[TaskController] Recebendo comando 'update_task' para ID ${payload.id}`,
    );
    return this.taskService.updateTask(payload);
  }

  @MessagePattern({ cmd: 'create_comment' })
  async handleCreateComment(@Payload() payload: CreateCommentPayload) {
    console.log(
      `[TaskController] Recebendo comando 'create_comment' para Task ID ${payload.taskId}`,
    );
    return this.taskService.createComment(payload);
  }

  @EventPattern('ping')
  async handlePing(data: any) {
    console.log('Ping recebido:', data);
  }
}
