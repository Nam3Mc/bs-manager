import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-line bg-raised/50 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center",
        className
      )}
    >
      <h3 className="font-display text-content text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
