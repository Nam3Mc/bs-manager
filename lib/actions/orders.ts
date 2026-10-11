"use server";

import { redirect } from "next/navigation"; 
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { getBusinessForOwner } from "@/lib/queries";
import { releaseStock } from "../inventory";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const ALLOWED: readonly OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// export async function updateOrderStatusAction(
  // orderId: string,
  // nextStatus: OrderStatus
// ): Promise<{ error?: string }> {
  // const session = await requireRole("ADMIN");
  // const business = await getBusinessForOwner(session.userId);
  // if (!business) return { error: "No business associated with this account" };
// 
  // if (!ALLOWED.includes(nextStatus)) {
    // return { error: "Invalid status" };
  // }
// 
  // try {
    // const result = await sql`
      // UPDATE orders o
      // SET status = ${nextStatus}
      // FROM stores s
      // WHERE o.id = ${orderId}
        // AND o.store_id = s.id
        // AND s.business_id = ${business.id}
      // RETURNING o.id
    // `;
    // if (result.length === 0) return { error: "Order not found" };
  // } catch (err) {
    // console.error("[updateOrderStatusAction]", err);
    // return { error: "Failed to update order" };
  // }
// 
  // revalidatePath("/admin/orders");
  // revalidatePath(`/admin/orders/${orderId}`);
  // revalidatePath("/admin/dashboard");
  // return {};
// }

export async function updateOrderStatusAction(
  orderId: string,
  nextStatus: OrderStatus
): Promise<{ error?: string }> {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) return { error: "No business associated with this account" };

  if (!ALLOWED.includes(nextStatus)) {
    return { error: "Invalid status" };
  }

  try {
    // Read the current status (and verify ownership) before changing.
    const currentRows = await sql`
      SELECT o.status
      FROM orders o
      JOIN stores s ON s.id = o.store_id
      WHERE o.id = ${orderId} AND s.business_id = ${business.id}
      LIMIT 1
    `;
    const currentStatus = (currentRows[0] as { status: OrderStatus } | undefined)
      ?.status;
    if (!currentStatus) return { error: "Order not found" };

    // Transition INTO cancelled → put the stock back.
    if (nextStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
      const lines = (await sql`
        SELECT product_id, quantity FROM order_lines WHERE order_id = ${orderId}
      `) as { product_id: string; quantity: number }[];

      await releaseStock(
        lines.map((l) => ({
          productId: l.product_id,
          quantity: Number(l.quantity),
        }))
      );
    }

    await sql`
      UPDATE orders o
      SET status = ${nextStatus}
      FROM stores s
      WHERE o.id = ${orderId}
        AND o.store_id = s.id
        AND s.business_id = ${business.id}
    `;
  } catch (err) {
    console.error("[updateOrderStatusAction]", err);
    return { error: "Failed to update order" };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/items");
  revalidatePath("/market/orders");
  return {};
}

const TAX_RATE = 0.08; // flat demo tax

export async function createOrdersFromCartAction(): Promise<{ error?: string }> {
  const session = await requireRole("CLIENT");

  type Row = {
    cart_item_id: string;
    product_id: string;
    quantity: number;
    price: string;
    store_id: string;
  };

  let lines: Row[];
  try {
    lines = (await sql`
      SELECT ci.id AS cart_item_id, ci.product_id, ci.quantity,
             p.price, p.store_id
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ${session.userId}
    `) as Row[];
  } catch (err) {
    console.error("[createOrdersFromCartAction] read cart", err);
    return { error: "Failed to read cart" };
  }

  if (lines.length === 0) return { error: "Your cart is empty" };

  const byStore = new Map<string, Row[]>();
  for (const line of lines) {
    const arr = byStore.get(line.store_id) ?? [];
    arr.push(line);
    byStore.set(line.store_id, arr);
  }

  const createdIds: string[] = [];

  try {
    for (const [storeId, storeLines] of byStore) {
      const subtotal = storeLines.reduce(
        (sum, l) => sum + Number(l.price) * l.quantity,
        0
      );
      const tax = subtotal * TAX_RATE;
      const total = subtotal + tax;

      const orderRows = (await sql`
        INSERT INTO orders (user_id, store_id, status, subtotal, tax, total)
        VALUES (${session.userId}, ${storeId}, 'PENDING',
                ${subtotal}, ${tax}, ${total})
        RETURNING id
      `) as { id: string }[];
      const orderId = orderRows[0].id;
      createdIds.push(orderId);

      for (const line of storeLines) {
        const lineTotal = Number(line.price) * line.quantity;
        await sql`
          INSERT INTO order_lines
            (order_id, product_id, quantity, unit_price, line_total)
          VALUES
            (${orderId}, ${line.product_id}, ${line.quantity},
             ${line.price}, ${lineTotal})
        `;
      }
    }

    await sql`DELETE FROM cart_items WHERE user_id = ${session.userId}`;
  } catch (err) {
    console.error("[createOrdersFromCartAction] create", err);
    return { error: "Failed to place order. Please try again." };
  }

  revalidatePath("/market");
  revalidatePath("/market/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");

  redirect(`/market/orders?placed=${createdIds.length}`);
}