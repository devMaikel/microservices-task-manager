import type { Control, FieldPath } from "react-hook-form";
import type { SignInFormSchema, SignUpFormSchema } from "./Schemas";

export interface SignupFormFieldProps {
  name: FieldPath<SignUpFormSchema>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<SignUpFormSchema, any>;
}

export interface RegisterFormProps {
  onSubmit: (data: SignUpFormSchema) => void;
}

export interface SigninFormFieldProps {
  name: FieldPath<SignInFormSchema>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<SignInFormSchema, any>;
}

export interface LoginFormProps {
  onSubmit: (data: SignInFormSchema) => void;
}
