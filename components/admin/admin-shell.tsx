"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar";
import { Topbar } from "./topbar";
import { CloseIcon } from "./icons";
import type { SessionPayload } from "@/lib/auth";

export function AdminShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="bg-surface flex min-h-dvh">
      <aside className="border-line bg-sunken hidden w-60 shrink-0 flex-col border-r md:flex">
        <div className="border-line flex h-14 shrink-0 items-center border-b px-4">
          <BrandLink />
        </div>
        <SidebarNav />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="border-line bg-sunken absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col border-r shadow-xl"
          >
            <div className="border-line flex items-center justify-between border-b px-4 py-3">
              <BrandLink />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="text-muted hover:bg-hover hover:text-content flex h-8 w-8 items-center justify-center rounded-lg"
              >
                <CloseIcon />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function BrandLink() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2">
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
      <span className="font-display text-content text-sm font-semibold tracking-tight">
        BS-Manager
      </span>
    </Link>
  );
}
