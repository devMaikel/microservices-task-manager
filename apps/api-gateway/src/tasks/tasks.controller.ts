import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('tasks')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('/tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly taskClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista tarefas com paginação.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de tarefas e metadados.' })
  async listTasks(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const sizeNum = parseInt(size, 10);

    const payload = { page: pageNum, size: sizeNum };
    console.log('[API Gateway] Enviando mensagem para list_tasks:', payload);
    this.taskClient.emit('ping', { message: 'olá' });
    return this.taskClient.send({ cmd: 'list_tasks' }, payload);
  }

  @ApiOperation({ summary: 'Busca uma tarefa pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID da tarefa (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.taskClient.send({ cmd: 'get_task_by_id' }, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova tarefa e atribui ao usuário logado.',
  })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const creatorId = req.user.userId;
    const payload = {
      ...createTaskDto,
      creatorId: creatorId,
    };
    return this.taskClient.send({ cmd: 'create_task' }, payload);
  }

  @ApiOperation({ summary: 'Atualiza uma tarefa pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID da tarefa (UUID)', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada e evento task.updated publicado.',
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    const payload = {
      id: id,
      userId: userId,
      updateData: updateTaskDto,
    };

    return this.taskClient.send({ cmd: 'update_task' }, payload);
  }

  @ApiOperation({ summary: 'Adiciona um novo comentário a uma tarefa.' })
  @ApiParam({ name: 'id', description: 'ID da tarefa (UUID)', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Comentário criado e evento task.comment.created publicado.',
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  @Post(':id/comments')
  async createComment(
    @Param('id') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    const payload = {
      taskId: taskId,
      userId: userId,
      content: createCommentDto.content,
    };

    return this.taskClient.send({ cmd: 'create_comment' }, payload);
  }
}
