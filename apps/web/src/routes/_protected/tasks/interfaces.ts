import type { z } from "zod";
import type { taskFormSchema } from "./components/TaskForm";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  description: string;
  comments: TaskComment[];
  creatorId?: string;
  assignedUserIds?: string[];
  commentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  author?: CommentAuthor;
}

export interface PaginatedTasksResponse {
	data: Task[];
	total: number;
	page: number;
	size: number;
}

export interface TaskComment {
	id: string;
	taskId: string;
	author: CommentAuthor;
	content: string;
	createdAt: string;
	updatedAt?: string;
}

export interface CommentAuthor {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt?: string;
}

export interface PaginatedCommentsResponse {
	data: TaskComment[];
	total: number;
	page: number;
	size: number;
}

export interface EditTaskDialogProps {
	task: Task;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface TaskActionsDropdownProps {
	task: Task;
}

export interface TaskFormProps {
	onSubmit: (values: TaskFormValues) => void;
	isPending: boolean;
	defaultValues?: Partial<TaskFormValues>;
	submitButtonText?: string;
}

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export interface CreateCommentData {
	taskId: string;
	content: string;
}
