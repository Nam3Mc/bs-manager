import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { roleHome } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="bg-surface min-h-dvh">
      <header className="border-line bg-surface/80 sticky top-0 z-40 border-b backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-content text-lg font-semibold tracking-tight">
              BS-Manager
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <Link href={roleHome(session.role)}>
                <Button variant="primary" size="md">
                  Go to dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="md">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="md">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="border-line bg-raised text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
              <span className="bg-brand h-1.5 w-1.5 rounded-full" />
              Built for small food businesses
            </span>

            <h1 className="font-display text-content mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Track your stock.
              <br />
              <span className="text-brand">Publish your store.</span>
            </h1>

            <p className="text-muted mx-auto mt-6 max-w-xl text-base sm:text-lg">
              BS-Manager helps bakeries and food producers manage ingredients, build
              sellable products, and give customers a clean storefront to browse and order
              from.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {session ? (
                <Link href={roleHome(session.role)}>
                  <Button variant="primary" size="lg">
                    Continue to dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button variant="primary" size="lg">
                      Create your business
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" size="lg">
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <FeatureGrid />
        </div>
      </section>

      <footer className="border-line bg-sunken border-t">
        <div className="text-muted mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} BS-Manager. WDD 430 project.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-content">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-content">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* LogoMark / FeatureGrid / icons — unchanged from the previous version */
function LogoMark() {
  return (
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
  );
}

function FeatureGrid() {
  const features = [
    {
      title: "Inventory",
      body: "Track raw ingredients with units, stock levels, and cost per unit.",
      icon: <BoxIcon />,
    },
    {
      title: "Products",
      body: "Build sellable SKUs from items — 500 g corn, 1 kg corn, all from one ingredient.",
      icon: <TagIcon />,
    },
    {
      title: "Storefronts",
      body: "Publish a themed store page with hero image, description, and product grid.",
      icon: <StoreIcon />,
    },
  ];
  return (
    <div className="mt-20 grid gap-4 sm:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="border-line bg-raised hover:bg-hover rounded-xl border p-6 shadow-sm transition-colors duration-150 ease-out"
        >
          <div className="bg-brand-soft text-brand flex h-10 w-10 items-center justify-center rounded-lg">
            {f.icon}
          </div>
          <h3 className="font-display text-content mt-4 text-lg font-semibold">
            {f.title}
          </h3>
          <p className="text-muted mt-2 text-sm">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

function BoxIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function StoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9 4 4h16l1 5M4 9v11h16V9M9 22V12h6v10" />
    </svg>
  );
}
