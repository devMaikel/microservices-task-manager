export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  creatorId: string;
  assignedUserIds: string[];

  comments?: TaskComment[];
  history?: TaskHistory[];

  commentCount?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedAt: Date;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  size: number;
}
