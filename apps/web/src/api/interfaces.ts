export interface CreateTaskPayload {
	title: string;
	description?: string;
	dueDate: string;
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
	assignedUserIds?: string[];
}

export interface UpdateTaskPayload {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
    assignedUserIds?: string[];
}

export interface UpdateTaskData {
    taskId: string;
    payload: UpdateTaskPayload;
}

export interface UserBasic {
    id: string;
    name: string;
    email: string;
}
