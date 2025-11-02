import { z } from "zod";

export const signUpFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ message: "Informe um e-mail válido." })
      .max(120, { message: "O e-mail deve ter no máximo 120 caracteres." }),

    name: z
      .string()
      .trim()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
      .max(120, { message: "O nome deve ter no máximo 120 caracteres." }),

    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
      .max(26, { message: "A senha deve ter no máximo 26 caracteres." })
      .regex(/[A-Z]/, {
        message: "A senha deve conter pelo menos uma letra maiúscula.",
      })
      .regex(/[a-z]/, {
        message: "A senha deve conter pelo menos uma letra minúscula.",
      })
      .regex(/[0-9]/, {
        message: "A senha deve conter pelo menos um número.",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "A confirmação da senha é obrigatória." })
      .max(26, { message: "A senha deve ter no máximo 26 caracteres." })
      .regex(/[A-Z]/, {
        message: "A senha deve conter pelo menos uma letra maiúscula.",
      })
      .regex(/[a-z]/, {
        message: "A senha deve conter pelo menos uma letra minúscula.",
      })
      .regex(/[0-9]/, {
        message: "A senha deve conter pelo menos um número.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const signInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Informe um e-mail válido." })
    .max(120, { message: "O e-mail deve ter no máximo 120 caracteres." }),

  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .max(26, { message: "A senha deve ter no máximo 26 caracteres." }),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
export type SignInFormSchema = z.infer<typeof signInFormSchema>;
