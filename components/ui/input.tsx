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
        "h-10 w-full rounded-lg border bg-raised px-3 text-sm text-content",
        "placeholder:text-subtle",
        "transition-colors duration-150 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-brand",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        invalid ? "border-danger" : "border-line",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";