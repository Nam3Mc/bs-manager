import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full appearance-none rounded-lg border bg-raised px-3 pr-9 text-sm text-content",
        "transition-colors duration-150 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-brand",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')]",
        invalid ? "border-danger" : "border-line",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";