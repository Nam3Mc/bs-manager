"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner } from "@/lib/queries";

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
    const result = await sql`
      UPDATE orders o
      SET status = ${nextStatus}
      FROM stores s
      WHERE o.id = ${orderId}
        AND o.store_id = s.id
        AND s.business_id = ${business.id}
      RETURNING o.id
    `;
    if (result.length === 0) return { error: "Order not found" };
  } catch (err) {
    console.error("[updateOrderStatusAction]", err);
    return { error: "Failed to update order" };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
  return {};
}