"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner } from "@/lib/queries";

export type ItemFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

const ALLOWED_UNITS = ["G", "KG", "ML", "L", "UNIT"] as const;
type Unit = (typeof ALLOWED_UNITS)[number];

async function currentBusinessId(): Promise<string> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");
  return business.id;
}

function parseItemForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const unitRaw = String(formData.get("unit") ?? "G");
  const stockRaw = String(formData.get("currentStock") ?? "0");
  const costRaw = String(formData.get("unitCost") ?? "0");
  const imageRaw = String(formData.get("imageUrl") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Name must be at least 2 characters";

  const unit: Unit = (ALLOWED_UNITS as readonly string[]).includes(unitRaw)
    ? (unitRaw as Unit)
    : "G";
  const currentStock = Number(stockRaw);
  if (!Number.isFinite(currentStock) || currentStock < 0)
    fieldErrors.currentStock = "Must be a non-negative number";
  const unitCost = Number(costRaw);
  if (!Number.isFinite(unitCost) || unitCost < 0)
    fieldErrors.unitCost = "Must be a non-negative number";

  return {
    values: {
      name,
      unit,
      currentStock: Number.isFinite(currentStock) ? currentStock : 0,
      unitCost: Number.isFinite(unitCost) ? unitCost : 0,
      imageUrl: imageRaw || null,
    },
    fieldErrors,
  };
}

export async function createItemAction(
  _prev: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  const businessId = await currentBusinessId();
  const { values, fieldErrors } = parseItemForm(formData);
  if (Object.keys(fieldErrors).length > 0)
    return { error: "Please fix the highlighted fields", fieldErrors };

  try {
    await sql`
      INSERT INTO items (business_id, name, unit, current_stock, unit_cost, image_url)
      VALUES (${businessId}, ${values.name}, ${values.unit}, ${values.currentStock}, ${values.unitCost}, ${values.imageUrl})
    `;
  } catch (err) {
    console.error("[createItemAction]", err);
    return { error: "Failed to create item. Please try again." };
  }

  revalidatePath("/admin/items");
  revalidatePath("/admin/dashboard");
  redirect("/admin/items");
}

export async function updateItemAction(
  itemId: string,
  _prev: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  const businessId = await currentBusinessId();
  const { values, fieldErrors } = parseItemForm(formData);
  if (Object.keys(fieldErrors).length > 0)
    return { error: "Please fix the highlighted fields", fieldErrors };

  try {
    const result = await sql`
      UPDATE items
      SET name = ${values.name}, unit = ${values.unit},
          current_stock = ${values.currentStock}, unit_cost = ${values.unitCost},
          image_url = ${values.imageUrl}
      WHERE id = ${itemId} AND business_id = ${businessId}
      RETURNING id
    `;
    if (result.length === 0) return { error: "Item not found" };
  } catch (err) {
    console.error("[updateItemAction]", err);
    return { error: "Failed to update item. Please try again." };
  }

  revalidatePath("/admin/items");
  revalidatePath("/admin/dashboard");
  redirect("/admin/items");
}

export async function deleteItemAction(itemId: string): Promise<{ error?: string }> {
  const businessId = await currentBusinessId();
  try {
    const used = await sql`SELECT 1 FROM product_items WHERE item_id = ${itemId} LIMIT 1`;
    if (used.length > 0) {
      return {
        error:
          "This item is used by one or more products. Remove it from those products first.",
      };
    }
    await sql`DELETE FROM items WHERE id = ${itemId} AND business_id = ${businessId}`;
  } catch (err) {
    console.error("[deleteItemAction]", err);
    return { error: "Failed to delete item. Please try again." };
  }
  revalidatePath("/admin/items");
  revalidatePath("/admin/dashboard");
  return {};
}
