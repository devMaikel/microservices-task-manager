import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
	const { user } = useAuth();

	if (!user) {
		console.log("Usuário não logado!");
		return <Navigate to="/sign-in" />;
	}

	return <Outlet />;
}
