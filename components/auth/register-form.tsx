"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Role = "CLIENT" | "ADMIN";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLIENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong");
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <span className="text-sm font-medium text-content">I am a…</span>
        <div className="grid grid-cols-2 gap-2">
          <RoleCard
            active={role === "CLIENT"}
            onClick={() => setRole("CLIENT")}
            title="Customer"
            body="Browse stores and place orders"
          />
          <RoleCard
            active={role === "ADMIN"}
            onClick={() => setRole("ADMIN")}
            title="Business owner"
            body="Manage items, products, and a storefront"
          />
        </div>
      </div>

      <Field label="Full name" htmlFor="name">
        <Input
          id="name"
          autoComplete="name"
          required
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          invalid={!!error}
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalid={!!error}
        />
      </Field>

      <Field label="Password" htmlFor="password" hint="At least 8 characters">
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          invalid={!!error}
        />
      </Field>

      {error && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

function RoleCard({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-start rounded-xl border p-3 text-left transition-colors duration-150 ease-out",
        active ? "border-brand bg-brand-soft" : "border-line bg-raised hover:bg-hover"
      )}
    >
      <span className={cn("text-sm font-semibold", active ? "text-brand" : "text-content")}>
        {title}
      </span>
      <span className="mt-1 text-xs text-muted">{body}</span>
    </button>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium text-content">{label}</label>
        {hint && <span className="text-xs text-subtle">{hint}</span>}
      </div>
      {children}
    </div>
  );
}