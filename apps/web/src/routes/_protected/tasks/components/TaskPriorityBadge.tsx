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

	const highClass =
		priority === "HIGH" ? "border-yellow-500 text-yellow-600" : "";

	return (
		<Badge
			variant={variantMap[priority]}
			className={cn(highClass, "capitalize")}
		>
			{priority.toLowerCase()}
		</Badge>
	);
}
