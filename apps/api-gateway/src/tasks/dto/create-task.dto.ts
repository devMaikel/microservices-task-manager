import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { TaskStatus, TaskPriority } from '../../common/enums/task.enum';

export class CreateTaskDto {
  @IsString({ message: 'O título deve ser uma string.' })
  @IsNotEmpty({ message: 'O título da tarefa é obrigatório.' })
  @ApiProperty({
    description: 'Título da tarefa (obrigatório).',
    example: 'Implementar Soft Delete na Task',
    maxLength: 255,
  })
  title!: string;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @ApiProperty({
    description: 'Descrição detalhada da tarefa.',
    example: 'Adicionar a coluna deletedAt e lógica de exclusão suave.',
    required: false,
    nullable: true,
  })
  description!: string;

  @IsDateString(
    {},
    { message: 'A data limite deve ser uma data válida (ISO 8601).' },
  )
  @IsNotEmpty({ message: 'A data limite (dueDate) é obrigatória.' })
  @ApiProperty({
    description: 'Data limite para conclusão da tarefa.',
    example: '2025-11-15T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  dueDate!: Date;

  @IsEnum(TaskPriority, {
    message:
      'A prioridade deve ser um valor válido (LOW, MEDIUM, HIGH, URGENT).',
  })
  @IsNotEmpty({ message: 'A prioridade da tarefa é obrigatória.' })
  @ApiProperty({
    description: 'Prioridade da tarefa.',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @IsEnum(TaskStatus, { message: 'O status deve ser um valor válido.' })
  @IsOptional()
  @ApiProperty({
    description:
      'Status inicial da tarefa (opcional, TaskService define TODO como padrão).',
    enum: TaskStatus,
    example: TaskStatus.TODO,
    default: TaskStatus.TODO,
    required: false,
  })
  status?: TaskStatus;
}
