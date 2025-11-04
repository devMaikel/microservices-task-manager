import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<header className="p-4 bg-gray-100 border-b">
				<nav className="flex gap-4">
					<Link to="/" className="[&.active]:font-bold text-blue-600">
						Home
					</Link>

					<Link to="/sign-in" className="[&.active]:font-bold text-blue-600">
						Entrar
					</Link>

					<Link to="/sign-up" className="[&.active]:font-bold text-blue-600">
						Registrar
					</Link>

					<Link to="/tasks" className="[&.active]:font-bold text-blue-600">
						Tarefas
					</Link>
				</nav>
			</header>
			<main className="flex-grow">
				<Outlet />
			</main>
		</>
	),
});
