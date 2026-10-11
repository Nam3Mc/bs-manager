"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner } from "@/lib/queries";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

type ParsedRecipe = { itemId: string; quantity: number };

function parseProductForm(formData: FormData) {
  const storeId = String(formData.get("storeId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("price") ?? "0");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const isActive =
    formData.get("isActive") === "on" || formData.get("isActive") === "true";
  const recipeRaw = String(formData.get("recipe") ?? "[]");

  const fieldErrors: Record<string, string> = {};

  if (!storeId) fieldErrors.storeId = "Select a store";
  if (name.length < 2) fieldErrors.name = "Name must be at least 2 characters";

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0)
    fieldErrors.price = "Price must be a non-negative number";

  let recipe: ParsedRecipe[] = [];
  try {
    const parsed = JSON.parse(recipeRaw) as unknown;
    if (Array.isArray(parsed)) {
      const seen = new Set<string>();
      for (const entry of parsed) {
        const obj = entry as Record<string, unknown>;
        const itemId = typeof obj.itemId === "string" ? obj.itemId : "";
        const qty = Number(obj.quantity);
        if (!itemId) continue;
        if (!Number.isFinite(qty) || qty <= 0) continue;
        if (seen.has(itemId)) continue;
        seen.add(itemId);
        recipe.push({ itemId, quantity: qty });
      }
    }
  } catch {
    fieldErrors.recipe = "Invalid recipe data";
  }

  return {
    values: {
      storeId,
      name,
      description,
      price: Number.isFinite(price) ? price : 0,
      imageUrl,
      isActive,
      recipe,
    },
    fieldErrors,
  };
}

async function verifyStoreBelongsToBusiness(
  storeId: string,
  businessId: string
): Promise<boolean> {
  const rows = await sql`
    SELECT 1 FROM stores WHERE id = ${storeId} AND business_id = ${businessId} LIMIT 1
  `;
  return rows.length > 0;
}

async function verifyItemsBelongToBusiness(
  itemIds: string[],
  businessId: string
): Promise<boolean> {
  if (itemIds.length === 0) return true;
  const rows = await sql`
    SELECT id FROM items WHERE business_id = ${businessId} AND id = ANY(${itemIds}::uuid[])
  `;
  return rows.length === itemIds.length;
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "Set up your business first" };

  const { values, fieldErrors } = parseProductForm(formData);
  if (Object.keys(fieldErrors).length > 0)
    return { error: "Fix the highlighted fields", fieldErrors };

  if (!(await verifyStoreBelongsToBusiness(values.storeId, business.id))) {
    return { error: "Invalid store" };
  }
  if (
    !(await verifyItemsBelongToBusiness(
      values.recipe.map((r) => r.itemId),
      business.id
    ))
  ) {
    return { error: "One or more items don't belong to your business" };
  }

  try {
    const productRows = await sql`
      INSERT INTO products (store_id, name, description, price, image_url, is_active)
      VALUES (${values.storeId}, ${values.name}, ${values.description}, ${values.price}, ${values.imageUrl}, ${values.isActive})
      RETURNING id
    `;
    const productId = (productRows[0] as { id: string }).id;

    for (const line of values.recipe) {
      await sql`
        INSERT INTO product_items (product_id, item_id, quantity)
        VALUES (${productId}, ${line.itemId}, ${line.quantity})
      `;
    }
  } catch (err) {
    console.error("[createProductAction]", err);
    return { error: "Failed to create product" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "Set up your business first" };

  const { values, fieldErrors } = parseProductForm(formData);
  if (Object.keys(fieldErrors).length > 0)
    return { error: "Fix the highlighted fields", fieldErrors };

  if (!(await verifyStoreBelongsToBusiness(values.storeId, business.id))) {
    return { error: "Invalid store" };
  }
  if (
    !(await verifyItemsBelongToBusiness(
      values.recipe.map((r) => r.itemId),
      business.id
    ))
  ) {
    return { error: "One or more items don't belong to your business" };
  }

  try {
    const updated = await sql`
      UPDATE products p
      SET store_id = ${values.storeId},
          name = ${values.name},
          description = ${values.description},
          price = ${values.price},
          image_url = ${values.imageUrl},
          is_active = ${values.isActive}
      FROM stores s
      WHERE p.id = ${productId}
        AND p.store_id = s.id
        AND s.business_id = ${business.id}
      RETURNING p.id
    `;
    if (updated.length === 0) return { error: "Product not found" };

    await sql`DELETE FROM product_items WHERE product_id = ${productId}`;
    for (const line of values.recipe) {
      await sql`
        INSERT INTO product_items (product_id, item_id, quantity)
        VALUES (${productId}, ${line.itemId}, ${line.quantity})
      `;
    }
  } catch (err) {
    console.error("[updateProductAction]", err);
    return { error: "Failed to update product" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  redirect("/admin/products");
}

export async function deleteProductAction(
  productId: string
): Promise<{ error?: string }> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "No business associated with this account" };

  try {
    const used = await sql`
      SELECT 1 FROM order_lines ol
      JOIN products p ON p.id = ol.product_id
      JOIN stores s ON s.id = p.store_id
      WHERE ol.product_id = ${productId} AND s.business_id = ${business.id}
      LIMIT 1
    `;
    if (used.length > 0) {
      return { error: "This product has orders against it. Deactivate it instead." };
    }

    await sql`
      DELETE FROM products p
      USING stores s
      WHERE p.id = ${productId}
        AND p.store_id = s.id
        AND s.business_id = ${business.id}
    `;
  } catch (err) {
    console.error("[deleteProductAction]", err);
    return { error: "Failed to delete product" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  return {};
}
