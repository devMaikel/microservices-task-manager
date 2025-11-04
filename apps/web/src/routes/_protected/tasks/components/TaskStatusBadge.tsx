import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "../interfaces";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, RefreshCw, Eye } from "lucide-react";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
	const variantMap: Record<TaskStatus, "default" | "secondary" | "outline"> = {
		TODO: "secondary",
		IN_PROGRESS: "default",
		REVIEW: "outline",
		DONE: "default",
	};

	const STATUS_CONFIG = {
		TODO: { label: "A Fazer", variant: "secondary", icon: Clock },
		IN_PROGRESS: { label: "Em Progresso", variant: "default", icon: RefreshCw },
		REVIEW: { label: "Em Revisão", variant: "outline", icon: Eye },
		DONE: {
			label: "Concluída",
			variant: "default",
			className: "bg-green-600 text-white hover:bg-green-700",
			icon: CheckCircle,
		},
	};

	const doneClass =
		status === "DONE" ? "bg-green-600 text-white hover:bg-green-700" : "";

	return (
		<Badge variant={variantMap[status]} className={cn(doneClass, "capitalize")}>
			{STATUS_CONFIG[status].label}
		</Badge>
	);
}
