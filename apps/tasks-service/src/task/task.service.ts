import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { TaskHistory } from './entities/task-history.entity';
import { TaskStatus } from '../common/enums/task.enum';
import { PaginatedTasks, TaskDiff } from './interfaces/task.interfaces';
import { UpdateTaskPayload } from './dto/update-task.payload';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
    // @Inject('RABBITMQ_CLIENT') private readonly rabbitClient: ClientProxy,
    private dataSource: DataSource,
  ) {}

  private async registerCreationHistory(
    taskId: string,
    creatorId: string,
    manager: any = this.historyRepository,
  ): Promise<void> {
    const history = manager.create(TaskHistory, {
      taskId,
      userId: creatorId,
      field: 'task',
      oldValue: 'NULL',
      newValue: 'CREATED',
    });
    await manager.save(history);
  }

  private generateHistoryDiff(
    oldTask: Task,
    newUpdate: Partial<Task>,
  ): TaskDiff[] {
    const diffs: TaskDiff[] = [];
    const monitoredKeys = [
      'title',
      'description',
      'dueDate',
      'priority',
      'status',
      'assignedUserIds',
    ];

    for (const key of monitoredKeys) {
      const oldValue = oldTask[key as keyof Task];
      const newValue = newUpdate[key as keyof Task];

      if (!(key in newUpdate)) {
        continue;
      }

      if (key === 'assignedUserIds') {
        const oldArray = Array.isArray(oldValue)
          ? oldValue.sort().join(',')
          : '';
        const newArray = Array.isArray(newValue)
          ? (newValue as string[]).sort().join(',')
          : '';

        if (oldArray !== newArray) {
          diffs.push({
            field: key,
            oldValue: oldArray,
            newValue: newArray,
          });
        }
      } else if (oldValue !== newValue) {
        const oldStr =
          oldValue instanceof Date ? oldValue.toISOString() : String(oldValue);
        const newStr =
          newValue instanceof Date ? newValue.toISOString() : String(newValue);

        if (oldStr !== newStr) {
          diffs.push({
            field: key,
            oldValue: oldStr,
            newValue: newStr,
          });
        }
      }
    }

    return diffs;
  }

  private async saveHistory(
    taskId: string,
    userId: string,
    diffs: TaskDiff[],
    manager: any,
  ): Promise<void> {
    if (diffs.length === 0) return;

    const historyEntities = diffs.map((diff) =>
      manager.create(TaskHistory, {
        taskId,
        userId,
        field: diff.field,
        oldValue: diff.oldValue,
        newValue: diff.newValue,
      }),
    );
    await manager.save(historyEntities);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = this.taskRepository.create({
        ...createTaskDto,
        status: TaskStatus.TODO,
      });

      const savedTask = await queryRunner.manager.save(task);

      await this.registerCreationHistory(
        savedTask.id,
        savedTask.creatorId,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      // this.rabbitClient.emit('task.created', {
      //   taskId: savedTask.id,
      //   creatorId: savedTask.creatorId,
      //   assignedUserIds: savedTask.assignedUserIds,
      //   title: savedTask.title,
      // });

      return savedTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        statusCode: 400,
        message: `Failed to create task: ${error.message}`,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async getTasks(pagination: PaginationDto): Promise<PaginatedTasks> {
    const { page = 1, size = 10 } = pagination;
    const skip = (page - 1) * size;

    // Usar 'findAndCount' é a forma mais idiomática e limpa para
    // paginação simples, sem a necessidade de QueryBuilder.
    // Ele executa as duas queries necessárias (SELECT com LIMIT/OFFSET e COUNT total).
    const [tasks, total] = await this.taskRepository.findAndCount({
      take: size,
      skip: skip,
      order: { createdAt: 'DESC' },
      // O Soft-Delete (deletedAt IS NULL) é aplicado automaticamente aqui.
    });

    return {
      data: tasks,
      total: total,
      page,
      size,
    };
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['comments', 'history'],
    });

    if (!task) {
      throw new RpcException({
        statusCode: 404,
        message: `Task with ID ${id} not found.`,
      });
    }

    return task;
  }

  async updateTask(payload: UpdateTaskPayload): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id, userId, updateData } = payload;

      const oldTask = await queryRunner.manager.findOne(Task, {
        where: { id },
      });

      if (!oldTask) {
        throw new RpcException({
          statusCode: 404,
          message: `Task with ID ${id} not found.`,
        });
      }

      const diffs = this.generateHistoryDiff(
        oldTask,
        updateData as Partial<Task>,
      );

      const updatedTask = queryRunner.manager.merge(
        Task,
        oldTask,
        updateData,
      ) as Task;
      await queryRunner.manager.save(updatedTask);

      await this.saveHistory(id, userId, diffs, queryRunner.manager);

      await queryRunner.commitTransaction();

      if (diffs.length > 0) {
        // this.rabbitClient.emit('task.updated', {
        //   taskId: updatedTask.id,
        //   userId: userId,
        //   changes: diffs.map((d) => d.field),
        // });
      }

      return updatedTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        statusCode: 500,
        message: `Failed to update task: ${error.message}`,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
