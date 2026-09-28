import { requireRole } from "@/lib/session";

export default async function MarketHome() {
  const session = await requireRole("CLIENT");
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-content">
        Welcome, {session.name}
      </h1>
      <p className="mt-2 text-muted">Marketplace — coming next.</p>
    </main>
  );
}