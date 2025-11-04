import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { useUpdateTask } from "@/api/tasks";
import type { UpdateTaskPayload } from "@/api/interfaces";
import type { EditTaskDialogProps, TaskFormValues } from "../interfaces";

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
	task,
	isOpen,
	onOpenChange,
}) => {
	const { mutate, isPending } = useUpdateTask();

	const defaultValues: Partial<TaskFormValues> = {
		title: task.title,
		description: task.description,
		dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
		priority: task.priority,
		status: task.status,
	};

	const handleSubmit = (values: TaskFormValues) => {
		const payload: UpdateTaskPayload = {
			...values,
			dueDate: values.dueDate.toISOString(),
			description: values.description,
			status: values.status,
		};

		mutate(
			{ taskId: task.id, payload },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar Tarefa</DialogTitle>
					<DialogDescription>
						Edite os campos da tarefa{" "}
						<span className="font-medium">"{task.title}"</span>.
					</DialogDescription>
				</DialogHeader>
				<TaskForm
					onSubmit={handleSubmit}
					isPending={isPending}
					defaultValues={defaultValues}
					submitButtonText="Salvar Alterações"
				/>
			</DialogContent>
		</Dialog>
	);
};
