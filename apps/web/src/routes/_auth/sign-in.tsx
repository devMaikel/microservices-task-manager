import type { SignInFormSchema } from "@/components/auth/Schemas";
import { SigninForm } from "@/components/auth/SigninForm";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/sign-in")({
	component: SignIn,
});

function SignIn() {
	const { signIn } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (data: SignInFormSchema) => {
		try {
			await signIn(data.email, data.password);
			toast.success("Logado com sucesso!");
			navigate({ to: "/tasks" });
		} catch (err) {
			console.log("erro login: ", err);
			const message = (err as any)?.message || (err as any)?.response?.data?.message || "Credenciais inválidas.";
			toast.error(message);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
			<SigninForm onSubmit={handleSubmit} />
		</div>
	);
}
