import { TaskStatus, TaskPriority } from '../../common/enums/task.enum';

export class CreateTaskDto {
  title!: string;
  description!: string;
  dueDate!: Date;
  priority!: TaskPriority;
  status?: TaskStatus;
  creatorId!: string;

  assignedUserIds: string[] = [];
}
