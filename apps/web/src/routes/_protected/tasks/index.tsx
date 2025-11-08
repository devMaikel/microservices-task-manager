import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { PaginatedTasksResponse } from "./interfaces";
import { fetchTasks } from "@/api/tasks";
import { TaskStatusBadge } from "./components/TaskStatusBadge";
import { TaskPriorityBadge } from "./components/TaskPriorityBadge";
import { TaskPageSkeleton } from "./components/TaskPageSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { TaskActionsDropdown } from "./components/TaskActionsDropdown";

export const Route = createFileRoute("/_protected/tasks/")({
	component: TaskListPage,
});

function TaskListPage() {
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const { data, isLoading, isError, error } = useQuery<
		PaginatedTasksResponse,
		Error
	>({
		queryKey: ["tasks", { page, pageSize, debouncedSearchTerm, statusFilter }],
		queryFn: () =>
			fetchTasks(page, pageSize, debouncedSearchTerm, statusFilter),
		placeholderData: (previousData) => previousData,
	});

	useEffect(() => {
		setPage(1);
	}, [debouncedSearchTerm, statusFilter]);

	const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

	// if (isLoading) {
	// 	return <TaskPageSkeleton />;
	// }

	if (isLoading && page === 1 && !debouncedSearchTerm && !statusFilter) {
		return <TaskPageSkeleton />;
	}

	if (isError) {
		return (
			<div className="container mx-auto p-8">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Erro ao carregar tarefas</AlertTitle>
					<AlertDescription>
						{error.message || "Não foi possível buscar os dados."}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 md:p-8 space-y-6">
			<div className="flex items-center justify-between space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Minhas Tarefas</h1>
				<div className="flex items-center space-x-2">
					<CreateTaskDialog />
				</div>
			</div>

			<div className="flex items-center justify-between space-x-2">
				<div className="flex flex-1 items-center space-x-2">
					<Input
						placeholder="Filtrar por título..."
						className="max-w-sm"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Select
						value={statusFilter}
						onValueChange={(value) =>
							setStatusFilter(value === "all" ? "" : value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filtrar por status..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos os Status</SelectItem>
							<SelectItem value="TODO">A Fazer</SelectItem>
							<SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
							<SelectItem value="REVIEW">Em Revisão</SelectItem>
							<SelectItem value="DONE">Concluído</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

            <div className="rounded-lg border shadow-sm">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[380px] font-semibold">Tarefa</TableHead>
                            <TableHead className="font-semibold">Autor</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Prioridade</TableHead>
                            <TableHead className="font-semibold">Prazo</TableHead>
                            <TableHead className="text-right font-semibold">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Carregando novos dados...
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && data && data.data.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Nenhuma tarefa encontrada com os filtros aplicados.
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && data && data.data.length > 0 ? (
                            data.data.map((task, idx) => (
                                <TableRow
                                    key={task.id}
                                    className={cn(
                                        "hover:bg-muted/40",
                                        idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                                    )}
                                >
                                    <TableCell className="font-medium">
                                        <Link
                                            to="/tasks/$taskId"
                                            params={{ taskId: task.id }}
                                            className="hover:underline"
                                        >
                                            {task.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {task.author?.name ? (
                                            <Badge variant="outline" className="font-normal">
                                                {task.author.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <TaskStatusBadge status={task.status} />
                                    </TableCell>
                                    <TableCell>
                                        <TaskPriorityBadge priority={task.priority} />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                                            timeZone: "UTC",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TaskActionsDropdown task={task} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Nenhuma tarefa encontrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={(e) => {
								e.preventDefault();
								setPage((old) => Math.max(old - 1, 1));
							}}
							className={cn({
								"pointer-events-none text-muted-foreground": page === 1,
							})}
						/>
					</PaginationItem>
					<span className="text-sm text-muted-foreground">
						Página {page} de {totalPages}
					</span>
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={(e) => {
								e.preventDefault();
								setPage((old) => Math.min(old + 1, totalPages));
							}}
							className={cn({
								"pointer-events-none text-muted-foreground":
									page === totalPages,
							})}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
