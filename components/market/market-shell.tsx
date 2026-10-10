"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MarketUserMenu } from "./user-menu";
import { CartIcon } from "./icons";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/auth";

interface MarketShellProps {
  session: SessionPayload;
  cartCount: number;
  children: React.ReactNode;
}

export function MarketShell({ session, cartCount, children }: MarketShellProps) {
  const pathname = usePathname();
  const isStorePage = pathname !== "/market";

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/market" className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-contrast"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h18M3 12h18M3 17h12" />
              </svg>
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-content">
              BS-Manager
            </span>
          </Link>

          {/* Breadcrumb slot — shows "Marketplace" when on a store page */}
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <Link
              href="/market"
              className={cn(
                "rounded-md px-2 py-1 transition-colors duration-150",
                isStorePage
                  ? "text-muted hover:bg-hover hover:text-content"
                  : "font-medium text-content"
              )}
            >
              Marketplace
            </Link>
          </div>

          <div className="flex-1" />

          {/* Right cluster */}
          <ThemeToggle />

          <Link
            href="/market/cart"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg",
              "border border-line bg-raised text-muted",
              "transition-colors duration-150 ease-out",
              "hover:bg-hover hover:text-content",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            )}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span
                aria-hidden
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-contrast"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <MarketUserMenu name={session.name} email={session.email} />
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-line bg-sunken">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} BS-Manager</p>
          <p className="text-xs">WDD 430 course project</p>
        </div>
      </footer>
    </div>
  );
}