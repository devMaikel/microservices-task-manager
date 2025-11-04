import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { useCreateTask } from "@/api/tasks";
import type { TaskFormValues } from "../interfaces";

export const CreateTaskDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { mutate, isPending } = useCreateTask();

	const handleSubmit = (values: TaskFormValues) => {
		const payload = {
			...values,
			dueDate: values.dueDate.toISOString(),
		};

		mutate(payload, {
			onSuccess: () => {
				setIsOpen(false);
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					Criar Nova Tarefa
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Criar Nova Tarefa</DialogTitle>
					<DialogDescription>
						Preencha os detalhes abaixo para criar uma nova tarefa.
					</DialogDescription>
				</DialogHeader>
				<TaskForm
					onSubmit={handleSubmit}
					isPending={isPending}
					submitButtonText="Criar Tarefa"
				/>
			</DialogContent>
		</Dialog>
	);
};
