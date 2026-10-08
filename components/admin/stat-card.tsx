import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  accent?: boolean;
}

export function StatCard({ label, value, hint, icon, href, accent }: StatCardProps) {
  const inner = (
    <div
      className={cn(
        "flex h-full flex-col gap-3 rounded-xl border border-line bg-raised p-5 shadow-sm",
        "transition-colors duration-150 ease-out",
        href && "hover:bg-hover"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-subtle">
          {label}
        </span>
        {icon && <span className={cn(accent ? "text-brand" : "text-subtle")}>{icon}</span>}
      </div>
      <div className="num font-display text-2xl font-bold tracking-tight text-content">
        {value}
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );

  return href ? (
    <Link
      href={href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}