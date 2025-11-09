import { Comment } from '../entities/comment.entity';

export interface ListCommentsPayload {
  taskId: string;
  page: number;
  size: number;
}

export interface PaginatedComments {
  data: Comment[];
  total: number;
  page: number;
  size: number;
}
