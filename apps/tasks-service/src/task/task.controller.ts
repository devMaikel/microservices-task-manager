import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateTaskPayload } from './dto/update-task.payload';
import { DeleteTaskPayload } from './interfaces/task.interfaces';
import { ListTasksDto } from './dto/list-tasks-dto';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'list_tasks' })
  async handleListTasks(@Payload() filters: ListTasksDto) {
    console.log(
      `[TaskController] Recebendo comando wa 'list_tasks' para página ${filters.page}`,
    );
    return this.taskService.getTasks(filters);
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

  @MessagePattern({ cmd: 'delete_task' })
  async handleDeleteTask(@Payload() payload: DeleteTaskPayload) {
    console.log(
      `[TaskController] Recebendo comando 'delete_task' para ID ${payload.taskId}`,
    );
    return this.taskService.deleteTask(payload);
  }
}
