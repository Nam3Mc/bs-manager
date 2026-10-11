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

/** Paths under /market that are NOT store slugs. */
const RESERVED_MARKET_PATHS = ["/market/orders", "/market/cart", "/market/checkout"];

function isMarketplaceActive(pathname: string): boolean {
  if (pathname === "/market") return true;
  if (!pathname.startsWith("/market/")) return false;
  return !RESERVED_MARKET_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isOrdersActive(pathname: string): boolean {
  return pathname === "/market/orders" || pathname.startsWith("/market/orders/");
}

export function MarketShell({ session, cartCount, children }: MarketShellProps) {
  const pathname = usePathname();

  const marketplaceActive = isMarketplaceActive(pathname);
  const ordersActive = isOrdersActive(pathname);

  return (
    <div className="bg-surface flex min-h-dvh flex-col">
      <header className="border-line bg-surface/85 sticky top-0 z-40 border-b backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/market"
            className="focus-visible:ring-ring focus-visible:ring-offset-surface flex shrink-0 items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span
              aria-hidden
              className="bg-brand text-brand-contrast flex h-8 w-8 items-center justify-center rounded-lg"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7h18M3 12h18M3 17h12" />
              </svg>
            </span>
            <span className="font-display text-content hidden text-base font-semibold tracking-tight md:inline">
              BS-Manager
            </span>
          </Link>

          {/* Primary nav */}
          <ul className="flex items-center gap-0.5 sm:gap-1">
            <li>
              <NavLink href="/market" active={marketplaceActive}>
                Marketplace
              </NavLink>
            </li>
            <li>
              <NavLink href="/market/orders" active={ordersActive}>
                My orders
              </NavLink>
            </li>
          </ul>

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />

            <Link
              href="/market/cart"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-lg",
                "border-line bg-raised text-muted border",
                "transition-colors duration-150 ease-out",
                "hover:bg-hover hover:text-content",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                "focus-visible:ring-offset-surface focus-visible:ring-offset-2"
              )}
            >
              <CartIcon />
              {cartCount > 0 && (
                <span
                  aria-hidden
                  className="bg-accent text-accent-contrast absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <MarketUserMenu name={session.name} email={session.email} />
          </div>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-line bg-sunken border-t">
        <div className="text-muted mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} BS-Manager</p>
          <p className="text-xs">WDD 430 course project</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium",
        "transition-colors duration-150 ease-out",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        "focus-visible:ring-offset-surface focus-visible:ring-offset-2",
        active
          ? "bg-brand-soft text-brand"
          : "text-muted hover:bg-hover hover:text-content"
      )}
    >
      {children}
    </Link>
  );
}
