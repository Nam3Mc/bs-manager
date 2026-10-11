import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "bg-raised text-content min-h-24 w-full resize-y rounded-lg border px-3 py-2 text-sm",
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
Textarea.displayName = "Textarea";
