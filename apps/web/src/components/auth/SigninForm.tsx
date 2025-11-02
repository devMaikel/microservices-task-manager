import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { signInFormSchema, type SignInFormSchema } from "./Schemas";
import { AuthFormField } from "./AuthFormField";
import type { LoginFormProps } from "./interfaces";

export const SigninForm = ({ onSubmit }: LoginFormProps) => {
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "joaosilva@gmail.com",
      password: "coxinha123",
    },
  });
  const isPending = false;

  return (
    <Card className="w-[380px] border-2 shadow-xl hover:shadow-2xl transition-shadow duration-500">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-fit rounded-full bg-primary/10 p-3 mb-2">
          <User className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Faça o login no TaskFlow
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Gerencie suas tarefas de forma colaborativa.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <AuthFormField<SignInFormSchema>
              name="email"
              label="Email"
              placeholder="joaosilva@email.com"
              inputType="email"
              formControl={form.control}
            />
            <AuthFormField<SignInFormSchema>
              name="password"
              label="Senha"
              placeholder=""
              description="No mínimo 8 caracteres."
              inputType="password"
              formControl={form.control}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <Button
              type="submit"
              className="w-full text-lg h-10"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>

            <Separator className="my-2" />

            <p className="text-sm text-center text-muted-foreground">
              Não tem uma conta?
              <Link
                to={"/sign-up"}
                className="ml-1 font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Registrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
