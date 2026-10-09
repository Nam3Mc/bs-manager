"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner } from "@/lib/queries";
import { slugify } from "@/lib/utils";
import {
  isValidThemePreset,
  isValidBackgroundStyle,
  type ThemePreset,
  type BackgroundStyle,
} from "@/lib/store-themes";

export type StoreFormState = { error?: string; fieldErrors?: Record<string, string> } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "store";

  const rows = excludeId
    ? await sql`SELECT slug FROM stores WHERE id <> ${excludeId} AND (slug = ${root} OR slug LIKE ${root + "-%"})`
    : await sql`SELECT slug FROM stores WHERE slug = ${root} OR slug LIKE ${root + "-%"}`;
  const taken = new Set(rows.map((r) => (r as { slug: string }).slug));

  if (!taken.has(root)) return root;
  for (let i = 2; i < 100; i++) {
    const candidate = `${root}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${root}-${Date.now()}`;
}

function parseStoreForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const nit = String(formData.get("nit") ?? "").trim() || null;
  const contactEmail = String(formData.get("contactEmail") ?? "").trim() || null;
  const contactPhone = String(formData.get("contactPhone") ?? "").trim() || null;
  const slugInput = String(formData.get("slug") ?? "").trim();

  const themeRaw = String(formData.get("themePreset") ?? "default");
  const bgRaw = String(formData.get("backgroundStyle") ?? "plain");
  const themePreset: ThemePreset = isValidThemePreset(themeRaw) ? themeRaw : "default";
  const backgroundStyle: BackgroundStyle = isValidBackgroundStyle(bgRaw) ? bgRaw : "plain";

  const heroImageUrl = String(formData.get("heroImageUrl") ?? "").trim() || null;
  const heroHeadline = String(formData.get("heroHeadline") ?? "").trim() || null;
  const heroSubtext = String(formData.get("heroSubtext") ?? "").trim() || null;
  const isActive =
    formData.get("isActive") === "on" || formData.get("isActive") === "true";

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Name must be at least 2 characters";
  if (contactEmail && !EMAIL_RE.test(contactEmail)) {
    fieldErrors.contactEmail = "Enter a valid email address";
  }
  if (heroImageUrl && !/^https?:\/\//i.test(heroImageUrl)) {
    fieldErrors.heroImageUrl = "URL must start with http:// or https://";
  }

  return {
    values: {
      name,
      description,
      address,
      nit,
      contactEmail,
      contactPhone,
      slugInput,
      themePreset,
      backgroundStyle,
      heroImageUrl,
      heroHeadline,
      heroSubtext,
      isActive,
    },
    fieldErrors,
  };
}

export async function createStoreAction(
  _prev: StoreFormState,
  formData: FormData
): Promise<StoreFormState> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "Set up your business first" };

  const { values, fieldErrors } = parseStoreForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Fix the highlighted fields", fieldErrors };
  }

  try {
    const slug = await uniqueSlug(values.slugInput || values.name);
    await sql`
      INSERT INTO stores (
        business_id, slug, name, description, address, nit,
        contact_email, contact_phone,
        theme_preset, background_style,
        hero_image_url, hero_headline, hero_subtext, is_active
      )
      VALUES (
        ${business.id}, ${slug}, ${values.name}, ${values.description},
        ${values.address}, ${values.nit},
        ${values.contactEmail}, ${values.contactPhone},
        ${values.themePreset}, ${values.backgroundStyle},
        ${values.heroImageUrl}, ${values.heroHeadline}, ${values.heroSubtext},
        ${values.isActive}
      )
    `;
  } catch (err) {
    console.error("[createStoreAction]", err);
    return { error: "Failed to create store. Please try again." };
  }

  revalidatePath("/admin/stores");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  revalidatePath("/admin/dashboard");
  redirect("/admin/stores");
}

export async function updateStoreAction(
  storeId: string,
  _prev: StoreFormState,
  formData: FormData
): Promise<StoreFormState> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "Set up your business first" };

  const { values, fieldErrors } = parseStoreForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Fix the highlighted fields", fieldErrors };
  }

  try {
    const slug = await uniqueSlug(values.slugInput || values.name, storeId);
    const result = await sql`
      UPDATE stores
      SET slug = ${slug},
          name = ${values.name},
          description = ${values.description},
          address = ${values.address},
          nit = ${values.nit},
          contact_email = ${values.contactEmail},
          contact_phone = ${values.contactPhone},
          theme_preset = ${values.themePreset},
          background_style = ${values.backgroundStyle},
          hero_image_url = ${values.heroImageUrl},
          hero_headline = ${values.heroHeadline},
          hero_subtext = ${values.heroSubtext},
          is_active = ${values.isActive}
      WHERE id = ${storeId} AND business_id = ${business.id}
      RETURNING id
    `;
    if (result.length === 0) return { error: "Store not found" };
  } catch (err) {
    console.error("[updateStoreAction]", err);
    return { error: "Failed to update store. Please try again." };
  }

  revalidatePath("/admin/stores");
  revalidatePath(`/admin/stores/${storeId}/edit`);
  revalidatePath("/admin/dashboard");
  redirect("/admin/stores");
}

export async function deleteStoreAction(storeId: string): Promise<{ error?: string }> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "No business associated with this account" };

  try {
    const products = await sql`
      SELECT COUNT(*)::int AS count FROM products WHERE store_id = ${storeId}
    `;
    const count = (products[0] as { count: number } | undefined)?.count ?? 0;
    if (count > 0) {
      return {
        error: `This store has ${count} product${count === 1 ? "" : "s"}. Delete or move them first.`,
      };
    }

    await sql`
      DELETE FROM stores
      WHERE id = ${storeId} AND business_id = ${business.id}
    `;
  } catch (err) {
    console.error("[deleteStoreAction]", err);
    return { error: "Failed to delete store. Please try again." };
  }

  revalidatePath("/admin/stores");
  revalidatePath("/admin/dashboard");
  return {};
}