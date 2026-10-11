"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, LogoutIcon } from "./icons";

export function UserMenu({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hover:bg-hover focus-visible:ring-ring focus-visible:ring-offset-surface flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <span
          aria-hidden
          className="bg-brand text-brand-contrast flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
        >
          {initials || "U"}
        </span>
        <span className="text-content hidden max-w-[120px] truncate sm:block">
          {name}
        </span>
        <ChevronDownIcon
          className={cn(
            "text-subtle h-4 w-4 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="border-line bg-raised absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-lg"
        >
          <div className="border-line border-b px-4 py-3">
            <p className="text-content truncate text-sm font-medium">{name}</p>
            <p className="text-muted mt-0.5 truncate text-xs">{email}</p>
            <span className="bg-brand-soft text-brand mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase">
              {role === "ADMIN" ? "Business owner" : "Customer"}
            </span>
          </div>
          <div className="p-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={pending}
              className="text-muted hover:bg-hover hover:text-content focus-visible:ring-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
            >
              <LogoutIcon />
              <span>{pending ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
