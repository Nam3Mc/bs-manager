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
        "min-h-24 w-full resize-y rounded-lg border bg-raised px-3 py-2 text-sm text-content",
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
Textarea.displayName = "Textarea";