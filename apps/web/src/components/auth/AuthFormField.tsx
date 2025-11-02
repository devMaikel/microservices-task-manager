import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<T>;
}

export const AuthFormField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
}: AuthFormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputType === "password";
  const determinedInputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : inputType || "text";

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <div className="relative">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={determinedInputType}
                {...field}
                className={isPassword ? "pr-10" : ""}
              />
            </FormControl>

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
