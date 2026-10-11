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
        "border-line bg-raised flex h-full flex-col gap-3 rounded-xl border p-5 shadow-sm",
        "transition-colors duration-150 ease-out",
        href && "hover:bg-hover"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-subtle text-xs font-medium tracking-wider uppercase">
          {label}
        </span>
        {icon && (
          <span className={cn(accent ? "text-brand" : "text-subtle")}>{icon}</span>
        )}
      </div>
      <div className="num font-display text-content text-2xl font-bold tracking-tight">
        {value}
      </div>
      {hint && <p className="text-muted text-xs">{hint}</p>}
    </div>
  );

  return href ? (
    <Link
      href={href}
      className="focus-visible:ring-ring focus-visible:ring-offset-surface block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}
