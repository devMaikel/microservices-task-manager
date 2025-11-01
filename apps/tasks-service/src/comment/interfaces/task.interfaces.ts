import { Comment } from "../entities/comment.entity";

export interface ListCommentsPayload {
  taskId: string;
  page: number;
  size: number;
}

// A estrutura de retorno para o Gateway
export interface PaginatedComments {
  data: Comment[];
  total: number;
  page: number;
  size: number;
}
