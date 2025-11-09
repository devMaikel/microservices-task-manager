import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignupForm } from "@/components/auth/SignupForm";
import type { SignUpFormSchema } from "@/components/auth/Schemas";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/sign-up")({
	component: SignUp,
});

function SignUp() {
	const { signUp } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (data: SignUpFormSchema) => {
		try {
			await signUp(data.email, data.name, data.password);
			toast.success("Cadastrado com sucesso!");
			navigate({ to: "/tasks" });
		} catch (err) {
			console.log("erro Cadastro: ", err);
			const message = (err as any)?.message || (err as any)?.response?.data?.message || "E-mail já registrado.";
			toast.error(message);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
			<SignupForm onSubmit={handleSubmit} />
		</div>
	);
}
