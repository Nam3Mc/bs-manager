import { requireRole } from "@/lib/session";

export default async function AdminDashboard() {
  const session = await requireRole("ADMIN");
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-content">
        Welcome, {session.name}
      </h1>
      <p className="mt-2 text-muted">Admin dashboard — coming next.</p>
    </main>
  );
}