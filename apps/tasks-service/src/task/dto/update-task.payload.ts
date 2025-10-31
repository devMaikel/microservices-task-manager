import { UpdateTaskDto } from './update-task.dto';

export interface UpdateTaskPayload {
  id: string;
  userId: string;
  updateData: UpdateTaskDto;
}
