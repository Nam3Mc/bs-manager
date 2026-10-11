import type { Metadata } from "next";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/admin/page-header";
import { StoreForm } from "@/components/admin/stores/store-form";

export const metadata: Metadata = { title: "New store" };

export default async function NewStorePage() {
  await requireRole("ADMIN");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="New store"
        description="Set up your storefront. You can change everything later."
      />
      <StoreForm />
    </div>
  );
}
