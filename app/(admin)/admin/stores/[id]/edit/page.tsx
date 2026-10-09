import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getStoreById } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { StoreForm } from "@/components/admin/stores/store-form";
import {
  isValidThemePreset,
  isValidBackgroundStyle,
} from "@/lib/store-themes";

export const metadata: Metadata = { title: "Edit store" };

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const store = await getStoreById(id, business.id);
  if (!store) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Edit store" description={`Update ${store.name}`} />
      <StoreForm
        storeId={store.id}
        defaultValues={{
          name: store.name,
          slug: store.slug,
          description: store.description,
          address: store.address,
          nit: store.nit,
          contactEmail: store.contact_email,
          contactPhone: store.contact_phone,
          themePreset: isValidThemePreset(store.theme_preset)
            ? store.theme_preset
            : "default",
          backgroundStyle: isValidBackgroundStyle(store.background_style)
            ? store.background_style
            : "plain",
          heroImageUrl: store.hero_image_url,
          heroHeadline: store.hero_headline,
          heroSubtext: store.hero_subtext,
          isActive: store.is_active,
        }}
      />
    </div>
  );
}