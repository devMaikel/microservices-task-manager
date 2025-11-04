import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "./api";
import type {
	PaginatedTasksResponse,
	Task,
} from "@/routes/_protected/tasks/interfaces";
import type { CreateTaskPayload, UpdateTaskData } from "./interfaces";

export const fetchTasks = async (
	page: number,
	size: number,
	title?: string,
	status?: string
): Promise<PaginatedTasksResponse> => {
	const response = await api.get("/tasks", {
		params: {
			page,
			size,
			// Maikel implementar filtros no backend
			...(title && { title }),
			...(status && { status }),
		},
	});
	return response.data;
};

const createTask = async (data: CreateTaskPayload): Promise<Task> => {
	console.log("esaodata", data);
	const response = await api.post("/tasks", data);
	return response.data;
};

export const useCreateTask = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast.success("Tarefa criada com sucesso!");
		},
		onError: (err: Error) => {
			toast.error(`Falha ao criar tarefa: ${err.message}`);
		},
	});
};

const updateTask = async ({
	taskId,
	payload,
}: UpdateTaskData): Promise<Task> => {
	const response = await api.put(`/tasks/${taskId}`, payload);
	return response.data;
};

export const useUpdateTask = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateTask,
		onSuccess: (updatedTask) => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["task", updatedTask.id] });
			toast.success(`Tarefa "${updatedTask.title}" atualizada com sucesso!`);
		},
		onError: (err: Error) => {
			toast.error(`Falha ao atualizar tarefa: ${err.message}`);
		},
	});
};

const deleteTask = async (taskId: string): Promise<void> => {
	await api.delete(`/tasks/${taskId}`);
};

export const useDeleteTask = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			toast.success("Tarefa excluída com sucesso!");
		},
		onError: (err: Error) => {
			toast.error(`Falha ao excluir tarefa: ${err.message}`);
		},
	});
};
