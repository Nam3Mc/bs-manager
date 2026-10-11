import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "bg-raised text-content h-10 w-full rounded-lg border px-3 text-sm",
        "placeholder:text-subtle",
        "transition-colors duration-150 ease-out",
        "focus:ring-ring focus:border-brand focus:ring-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid ? "border-danger" : "border-line",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
