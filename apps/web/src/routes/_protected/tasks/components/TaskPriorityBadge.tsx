import { cn } from "@/lib/utils";
import type { TaskPriority } from "../interfaces";
import { Badge } from "@/components/ui/badge";

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
	const variantMap: Record<
		TaskPriority,
		"default" | "secondary" | "destructive" | "outline"
	> = {
		LOW: "secondary",
		MEDIUM: "default",
		HIGH: "outline",
		URGENT: "destructive",
	};

	const PRIORITY_CONFIG = {
		LOW: { label: "Baixa", variant: "secondary" },
		MEDIUM: { label: "Média", variant: "default" },
		HIGH: { label: "Alta", variant: "outline" },
		URGENT: {
			label: "Urgente",
			variant: "default",
			className: "border-yellow-500 text-yellow-600",
		},
	};

	const highClass =
		priority === "HIGH" ? "border-yellow-500 text-yellow-600" : "";

	return (
		<Badge
			variant={variantMap[priority]}
			className={cn(highClass, "capitalize")}
		>
			{PRIORITY_CONFIG[priority].label}
		</Badge>
	);
}
