"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner } from "@/lib/queries";
import { slugify } from "@/lib/utils";

export type StoreFormState = { error?: string; fieldErrors?: Record<string, string> } | null;

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "store";

  const rows = await sql`
    SELECT slug FROM stores WHERE slug = ${root} OR slug LIKE ${root + "-%"}
  `;
  const taken = new Set(rows.map((r) => (r as { slug: string }).slug));

  if (!taken.has(root)) return root;

  for (let i = 2; i < 100; i++) {
    const candidate = `${root}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }

  return `${root}-${Date.now()}`;
}

export async function createStoreAction(
  _prev: StoreFormState,
  formData: FormData
): Promise<StoreFormState> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "Set up your business first" };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const nit = String(formData.get("nit") ?? "").trim() || null;

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Name must be at least 2 characters";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Fix the highlighted fields", fieldErrors };
  }

  try {
    const slug = await uniqueSlug(name);
    await sql`
      INSERT INTO stores (business_id, slug, name, description, address, nit)
      VALUES (${business.id}, ${slug}, ${name}, ${description}, ${address}, ${nit})
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