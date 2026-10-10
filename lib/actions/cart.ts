"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";

export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<{ error?: string }> {
  const session = await requireRole("CLIENT");

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Invalid quantity" };
  }

  try {
    const rows = await sql`
      SELECT 1 FROM products WHERE id = ${productId} AND is_active = true LIMIT 1
    `;
    if (rows.length === 0) return { error: "Product not available" };

    await sql`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (${session.userId}, ${productId}, ${quantity})
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    `;
  } catch (err) {
    console.error("[addToCartAction]", err);
    return { error: "Failed to add to cart" };
  }

  revalidatePath("/market");
  revalidatePath("/market/cart");
  return {};
}

export async function updateCartQuantityAction(
  cartItemId: string,
  quantity: number
): Promise<{ error?: string }> {
  const session = await requireRole("CLIENT");

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    return { error: "Quantity must be between 1 and 999" };
  }

  try {
    const result = await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE id = ${cartItemId} AND user_id = ${session.userId}
      RETURNING id
    `;
    if (result.length === 0) return { error: "Cart item not found" };
  } catch (err) {
    console.error("[updateCartQuantityAction]", err);
    return { error: "Failed to update quantity" };
  }

  revalidatePath("/market/cart");
  revalidatePath("/market/checkout");
  return {};
}

export async function removeFromCartAction(
  cartItemId: string
): Promise<{ error?: string }> {
  const session = await requireRole("CLIENT");

  try {
    await sql`
      DELETE FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${session.userId}
    `;
  } catch (err) {
    console.error("[removeFromCartAction]", err);
    return { error: "Failed to remove item" };
  }

  revalidatePath("/market/cart");
  revalidatePath("/market/checkout");
  revalidatePath("/market");
  return {};
}

export async function clearCartAction(): Promise<{ error?: string }> {
  const session = await requireRole("CLIENT");
  try {
    await sql`DELETE FROM cart_items WHERE user_id = ${session.userId}`;
  } catch (err) {
    console.error("[clearCartAction]", err);
    return { error: "Failed to clear cart" };
  }
  revalidatePath("/market/cart");
  revalidatePath("/market/checkout");
  return {};
}