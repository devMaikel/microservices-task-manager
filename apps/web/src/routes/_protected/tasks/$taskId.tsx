import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MessageSquare, Users as UsersIcon } from "lucide-react";
import { TaskPriorityBadge } from "./components/TaskPriorityBadge";
import { TaskStatusBadge } from "./components/TaskStatusBadge";
import type { PaginatedCommentsResponse, Task } from "./interfaces";
import {
  fetchTaskById,
  fetchTaskComments,
  useCreateComment,
} from "@/api/tasks";
import { useAuth } from "@/hooks/useAuth";
import { fetchUsers } from "@/api/auth";
import type { UserBasic } from "@/api/interfaces";
import { useUpdateTask } from "@/api/tasks";

export const Route = createFileRoute("/_protected/tasks/$taskId")({
	component: TaskDetailPage,
});

function getUserIdFromToken(): string | null {
	try {
		const token = localStorage.getItem("accessToken");
		if (!token) return null;
		const payload = JSON.parse(atob(token.split(".")[1]));
		return payload?.sub ?? null;
	} catch {
		return null;
	}
}

function TaskDetailPage() {
	const { taskId } = Route.useParams();

	const { user } = useAuth();
	console.log("usheoa", user);

	const [commentsPage, setCommentsPage] = useState(1);
	const pageSize = 10;

	const {
		data: task,
		isLoading: isTaskLoading,
		isError: isTaskError,
		error: taskError,
	} = useQuery<Task, Error>({
		queryKey: ["task", taskId],
		queryFn: () => fetchTaskById(taskId),
	});

	const {
		data: commentsData,
		isLoading: isCommentsLoading,
		isError: isCommentsError,
		error: commentsError,
		refetch: refetchComments,
	} = useQuery<PaginatedCommentsResponse, Error>({
		queryKey: ["comments", taskId, commentsPage],
		queryFn: () => fetchTaskComments(taskId, commentsPage, pageSize),
		placeholderData: (prev) => prev,
	});

	console.log("emasn9ueuas data", commentsData);

	useEffect(() => {
		setCommentsPage(1);
	}, [taskId]);

	const userId = useMemo(() => getUserIdFromToken(), []);
	const canComment =
		!!task &&
		!!userId &&
		(task.creatorId === userId ||
			(task.assignedUserIds ?? []).includes(userId));

  const { mutate: createComment, isPending: isCommenting } = useCreateComment();
  const [commentText, setCommentText] = useState("");

  // Usuários para atribuição
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery<UserBasic[], Error>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const isAuthor = !!task && !!userId && task.creatorId === userId;
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedUserIds(task?.assignedUserIds ?? []);
  }, [task?.assignedUserIds]);

  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSaveAssignments = () => {
    if (!task) return;
    if (!isAuthor) return;
    updateTask({ taskId: task.id, payload: { assignedUserIds: selectedUserIds } });
  };

	const handleSubmitComment = () => {
		if (!commentText.trim()) return;
		createComment(
			{ taskId, content: commentText.trim() },
			{
				onSuccess: () => {
					setCommentText("");
					refetchComments();
				},
			}
		);
	};

	const totalCommentPages = commentsData
		? Math.ceil(commentsData.total / pageSize)
		: 1;

	if (isTaskLoading && commentsPage === 1) {
		return (
			<div className="container mx-auto p-4 md:p-8 space-y-6">
				<Skeleton className="h-10 w-64" />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<Card className="lg:col-span-2">
						<CardContent className="space-y-4">
							<Skeleton className="h-6 w-48" />
							<div className="flex gap-2">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-6 w-32" />
							</div>
							<Skeleton className="h-24 w-full" />
						</CardContent>
					</Card>
					<Card>
						<CardContent className="space-y-3">
							<Skeleton className="h-6 w-40" />
							{[...Array(3)].map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-12 w-full" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isTaskError) {
		return (
			<div className="container mx-auto p-8">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Erro ao carregar tarefa</AlertTitle>
					<AlertDescription>
						{taskError?.message ||
							"Não foi possível buscar os dados da tarefa."}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Detalhes da Tarefa
        </h1>
        <Button asChild variant="outline">
          <Link to="/tasks" className="hover:underline">
            Voltar para Lista
          </Link>
        </Button>
      </div>
      {/* Top grid: Detalhes da tarefa à esquerda, usuários à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-4">
            <CardTitle className="text-2xl">{task?.title}</CardTitle>
            {task && (
              <div className="flex flex-wrap items-center gap-3">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
                <Separator className="w-px h-6" />
                <div className="text-sm text-muted-foreground">
                  Data limite:{" "}
                  {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </div>
                {!!task.commentCount && (
                  <div className="text-sm text-muted-foreground">
                    Comentários: {task.commentCount}
                  </div>
                )}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              {task?.description ? (
                <p className="text-sm leading-relaxed">{task.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Sem descrição.</p>
              )}
            </div>
          </CardContent>
          {task && (
            <CardFooter className="border-t justify-between">
              <div className="text-xs text-muted-foreground">
                Criada em{" "}
                {new Date(task.createdAt ?? task.dueDate).toLocaleString(
                  "pt-BR"
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Atualizada em{" "}
                {new Date(task.updatedAt ?? task.dueDate).toLocaleString(
                  "pt-BR"
                )}
              </div>
            </CardFooter>
          )}
        </Card>
        {/* Painel de usuários à direita */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <CardTitle>Usuários</CardTitle>
            </div>

            {isUsersError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar usuários</AlertTitle>
                <AlertDescription>
                  {usersError?.message || "Não foi possível buscar os usuários."}
                </AlertDescription>
              </Alert>
            )}

            {isUsersLoading && (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            )}

            {!isUsersLoading && users && users.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum usuário disponível.
              </p>
            )}

            {!isUsersLoading && users && users.length > 0 && (
              <div className="space-y-2">
                {users.map((u) => {
                  const checked = selectedUserIds.includes(u.id);
                  return (
                    <label key={u.id} className="flex items-center gap-2 text-sm">
                      {isAuthor ? (
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleUserSelection(u.id)}
                          className="size-4"
                        />
                      ) : (
                        <span className={`inline-block size-3 rounded-sm border ${checked ? 'bg-primary border-primary' : 'bg-transparent border-muted-foreground/40'}`} />
                      )}
                      <span className="truncate">
                        {u.name} <span className="text-muted-foreground">({u.email})</span>
                      </span>
                    </label>
                  );
                })}

                {isAuthor && (
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSaveAssignments} disabled={isUpdating}>
                      {isUpdating ? "Salvando..." : "Salvar Atribuições"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comentários abaixo da tarefa */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle>Comentários</CardTitle>
          </div>

          {isCommentsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar comentários</AlertTitle>
              <AlertDescription>
                {commentsError?.message || "Não foi possível buscar os comentários."}
              </AlertDescription>
            </Alert>
          )}

          {isCommentsLoading && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          )}

          {!isCommentsLoading && commentsData && commentsData.data.length === 0 && (
            <p className="text-sm text-muted-foreground">Ainda não há comentários.</p>
          )}

          {!isCommentsLoading && commentsData && commentsData.data.length > 0 && (
            <div className="space-y-4">
              {commentsData.data.map((comment) => (
                <div key={comment.id} className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {comment.author.name} • {new Date(comment.createdAt).toLocaleString("pt-BR")}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCommentsPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground px-2">
                      Página {commentsPage} de {totalCommentPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCommentsPage((p) => Math.min(totalCommentPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {canComment ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Escreva seu comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment} disabled={isCommenting || !commentText.trim()}>
                  Enviar Comentário
                </Button>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTitle>Sem permissão para comentar</AlertTitle>
              <AlertDescription>
                Você precisa ser o criador da tarefa ou estar atribuído para comentar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskDetailPage;
