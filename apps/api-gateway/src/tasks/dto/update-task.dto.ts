import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  IsDate,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from 'src/common/enums/task.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assignedUserIds?: string[];
}
