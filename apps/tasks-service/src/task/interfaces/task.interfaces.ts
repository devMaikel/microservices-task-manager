import { Task } from '../task.entity';

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  size: number;
}
