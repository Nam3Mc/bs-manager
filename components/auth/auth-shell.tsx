import Link from "next/link";
import { type ReactNode } from "react";
import { ThemeToggle } from "../theme/theme-toggle";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-2">
      {/* ---------- LEFT: form ---------- */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-contrast"
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
            <span className="font-display text-lg font-semibold tracking-tight text-content">
              BS-Manager
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-10">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-bold tracking-tight text-content">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-6 text-sm text-muted">{footer}</p>
          </div>
        </main>
      </div>

      {/* ---------- RIGHT: brand panel ---------- */}
      <aside
        className="relative hidden overflow-hidden border-l border-line lg:block"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--brand) 18%, transparent), color-mix(in oklab, var(--brand) 4%, transparent) 60%, transparent)",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div />

          <div className="max-w-md">
            <p className="font-display text-3xl font-semibold leading-tight text-content">
              From raw ingredients to a live storefront — in one place.
            </p>
            <p className="mt-4 text-sm text-muted">
              Track stock, build products, and give your customers a
              storefront that feels like yours.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-xs text-muted">
            <Stat label="Items" value="∞" />
            <Stat label="Products" value="∞" />
            <Stat label="Stores" value="∞" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="num font-display text-2xl font-bold text-content">
        {value}
      </div>
      <div className="mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}