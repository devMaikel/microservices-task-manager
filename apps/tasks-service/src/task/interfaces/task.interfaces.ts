import { Task } from '../entities/task.entity';

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  size: number;
}

export interface TaskDiff {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface DeleteTaskPayload {
  taskId: string;
  userId: string;
}
