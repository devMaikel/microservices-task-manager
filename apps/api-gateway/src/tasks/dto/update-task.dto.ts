import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  IsDateString,
  IsString,
} from 'class-validator';
import {
  TaskPriority,
  TaskStatus,
} from '../../common/enums/task.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string.' })
  @ApiProperty({
    description: 'Novo título da tarefa (opcional).',
    example: 'Revisar implementação de Soft Delete',
    maxLength: 255,
    required: false,
  })
  title?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  @ApiProperty({
    description: 'Nova descrição detalhada da tarefa (opcional).',
    example: 'Verificar se o Soft Delete está funcionando em todos os endpoints.',
    required: false,
    nullable: true,
  })
  description?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data limite deve ser uma data válida (ISO 8601).' },
  )
  @ApiProperty({
    description: 'Nova data limite para conclusão da tarefa (opcional).',
    example: '2025-12-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  dueDate?: Date;

  @IsOptional()
  @IsEnum(TaskPriority, {
    message:
      'A prioridade deve ser um valor válido (LOW, MEDIUM, HIGH, URGENT).',
  })
  @ApiProperty({
    description: 'Nova prioridade da tarefa (opcional).',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    required: false,
  })
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'O status deve ser um valor válido (TODO, IN_PROGRESS, REVIEW, DONE).',
  })
  @ApiProperty({
    description: 'Novo status da tarefa (opcional).',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  status?: TaskStatus;

  @IsOptional()
  @IsArray({ message: 'A lista de assignedUserIds deve ser um array.' })
  @IsUUID('4', {
    each: true,
    message: 'Cada ID de usuário deve ser um UUID v4 válido.',
  })
  @ApiProperty({
    description: 'Nova lista de IDs de usuários atribuídos (opcional).',
    example: ['uuid-do-usuario-3', 'uuid-do-usuario-4'],
    type: [String],
    required: false,
  })
  assignedUserIds?: string[];
}