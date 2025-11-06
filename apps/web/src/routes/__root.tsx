import {
	createRootRoute,
	Outlet,
	Link,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import {
	LogOut,
	ListTodo,
	LayoutDashboard,
	User,
	Settings,
	BarChart3,
	Bell,
} from "lucide-react";
import { toast } from "sonner";

function getUserFromToken() {
	try {
		const token = localStorage.getItem("accessToken");
		if (!token) return null;
		const payload = JSON.parse(atob(token.split(".")[1]));
		return {
			id: payload?.sub,
			name: payload?.name,
			email: payload?.email,
		} as { id?: string; name?: string; email?: string };
	} catch {
		return null;
	}
}

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const { user, signOut } = useAuth();
	const decoded = getUserFromToken();

	console.log("useee", user);

	const displayName = user?.name ?? decoded?.name ?? "Usuário";
	const displayEmail = user?.email ?? decoded?.email ?? "sem-email";

	const initials = (displayName || "U")
		.split(" ")
		.map((n: any) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const handleLogout = () => {
		signOut();
		toast.success("Usuário deslogado!");
		navigate({ to: "/sign-in" });
	};

	const path = routerState.location.pathname;
	const showSidebar = path === "/tasks" || path.startsWith("/tasks/");

	return (
		<div className="min-h-screen w-full bg-background text-foreground flex">
			{showSidebar && (
				<aside className="w-72 border-r bg-muted/30 px-4 py-6 flex flex-col gap-6">
					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
								{initials}
							</div>
							<div className="min-w-0">
								<div className="font-medium truncate">{displayName}</div>
								<div className="text-xs text-muted-foreground truncate">
									{displayEmail}
								</div>
							</div>
						</div>
						<Separator className="my-3" />
						<Button
							variant="destructive"
							className="w-full"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-4 w-4" /> Sair
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex flex-col gap-2">
						{/* <Button asChild variant="ghost" className="justify-start">
                        <Link to="/" className="w-full [&.active]:bg-muted">
                            <Home className="mr-2 h-4 w-4" /> Início
                        </Link>
                    </Button> */}
						<Button asChild variant="ghost" className="justify-start">
							<Link to="/tasks" className="w-full [&.active]:bg-muted">
								<ListTodo className="mr-2 h-4 w-4" /> Tarefas
							</Link>
						</Button>

						{/* Atalhos adicionais (rota não implementada) */}
						<Button
							variant="ghost"
							className="justify-start"
							onClick={() => toast.info("Rota não implementada")}
						>
							<LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
						</Button>
						<Button
							variant="ghost"
							className="justify-start"
							onClick={() => toast.info("Rota não implementada")}
						>
							<User className="mr-2 h-4 w-4" /> Perfil
						</Button>
						<Button
							variant="ghost"
							className="justify-start"
							onClick={() => toast.info("Rota não implementada")}
						>
							<Settings className="mr-2 h-4 w-4" /> Configurações
						</Button>
						<Button
							variant="ghost"
							className="justify-start"
							onClick={() => toast.info("Rota não implementada")}
						>
							<BarChart3 className="mr-2 h-4 w-4" /> Relatórios
						</Button>
						<Button
							variant="ghost"
							className="justify-start"
							onClick={() => toast.info("Rota não implementada")}
						>
							<Bell className="mr-2 h-4 w-4" /> Notificações
						</Button>
					</nav>
				</aside>
			)}

			{/* Main content */}
			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	);
}
