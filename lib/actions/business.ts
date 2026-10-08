"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";

export type BusinessFormState = { error?: string } | null;

export async function createBusinessAction(
  _prev: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const session = await requireRole("ADMIN");

  const name = String(formData.get("name") ?? "").trim();
  const nit = String(formData.get("nit") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  if (name.length < 2) return { error: "Business name is required" };

  const existing = await sql`
    SELECT id FROM businesses WHERE owner_id = ${session.userId} LIMIT 1
  `;
  if (existing.length > 0) redirect("/admin/dashboard");

  try {
    await sql`
      INSERT INTO businesses (owner_id, name, nit, address)
      VALUES (${session.userId}, ${name}, ${nit}, ${address})
    `;
  } catch (err) {
    console.error("[createBusinessAction]", err);
    return { error: "Failed to create business. Please try again." };
  }

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}