"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutIcon } from "@/components/admin/icons";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface LogoutButtonProps {
  variant?: Variant;
  size?: Size;
  /** Show icon + label, icon-only, or label-only. Default: "both". */
  display?: "both" | "icon" | "label";
  /** Optional override — where to send the user after logout. Defaults to "/". */
  redirectTo?: string;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-contrast hover:bg-brand-hover",
  secondary: "border border-line bg-raised text-content hover:bg-hover",
  ghost: "text-muted hover:bg-hover hover:text-content",
  danger: "border border-danger/40 bg-danger/5 text-danger hover:bg-danger/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const iconSizes: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function LogoutButton({
  variant = "ghost",
  size = "md",
  display = "both",
  redirectTo = "/",
  className,
}: LogoutButtonProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(redirectTo);
      router.refresh();
    } catch {
      setPending(false);
    }
  }

  const label = pending ? "Signing out…" : "Sign out";
  const iconOnly = display === "icon";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap",
        "transition-colors duration-150 ease-out",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        "focus-visible:ring-offset-surface focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        iconOnly ? iconSizes[size] : sizes[size],
        className
      )}
    >
      {display !== "label" && <LogoutIcon />}
      {display !== "icon" && <span>{label}</span>}
    </button>
  );
}
