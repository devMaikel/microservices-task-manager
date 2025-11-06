import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "./api";
import type {
  PaginatedTasksResponse,
  Task,
  PaginatedCommentsResponse,
  CreateCommentData,
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

// ========================
// Detalhes da Task & Comentários
// ========================

export const fetchTaskById = async (taskId: string): Promise<Task> => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const fetchTaskComments = async (
  taskId: string,
  page = 1,
  size = 10
): Promise<PaginatedCommentsResponse> => {
  const response = await api.get(`/tasks/${taskId}/comments`, {
    params: { page, size },
  });
  return response.data;
};

const createComment = async ({ taskId, content }: CreateCommentData) => {
  const response = await api.post(`/tasks/${taskId}/comments`, { content });
  return response.data as { id: string };
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_result, variables) => {
      // Atualiza lista de comentários e detalhes da tarefa
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      toast.success("Comentário adicionado!");
    },
    onError: (err: Error) => {
      toast.error(`Falha ao comentar: ${err.message}`);
    },
  });
};
