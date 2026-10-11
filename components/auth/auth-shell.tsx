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
    <div className="bg-surface grid min-h-dvh lg:grid-cols-2">
      {/* ---------- LEFT: form ---------- */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2">
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
            <span className="font-display text-content text-lg font-semibold tracking-tight">
              BS-Manager
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-10">
          <div className="w-full max-w-md">
            <h1 className="font-display text-content text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-muted mt-2 text-sm">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <p className="text-muted mt-6 text-sm">{footer}</p>
          </div>
        </main>
      </div>

      {/* ---------- RIGHT: brand panel ---------- */}
      <aside
        className="border-line relative hidden overflow-hidden border-l lg:block"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--brand) 18%, transparent), color-mix(in oklab, var(--brand) 4%, transparent) 60%, transparent)",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div />

          <div className="max-w-md">
            <p className="font-display text-content text-3xl leading-tight font-semibold">
              From raw ingredients to a live storefront — in one place.
            </p>
            <p className="text-muted mt-4 text-sm">
              Track stock, build products, and give your customers a storefront that feels
              like yours.
            </p>
          </div>

          <div className="text-muted grid grid-cols-3 gap-6 text-xs">
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
      <div className="num font-display text-content text-2xl font-bold">{value}</div>
      <div className="mt-1 tracking-wider uppercase">{label}</div>
    </div>
  );
}
