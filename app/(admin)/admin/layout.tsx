import { requireRole } from "@/lib/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("ADMIN");
  return <AdminShell session={session}>{children}</AdminShell>;
}
