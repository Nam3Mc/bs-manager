import { sql } from "@/lib/db";

export type Business = {
  id: string;
  name: string;
  nit: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
};

export type ItemRow = {
  id: string;
  business_id: string;
  name: string;
  unit: "G" | "KG" | "ML" | "L" | "UNIT";
  current_stock: string;
  unit_cost: string;
  image_url: string | null;
  created_at: string;
};

export type ItemStats = { item_count: number; stock_value: string };

export async function getBusinessForOwner(ownerId: string): Promise<Business | null> {
  const rows = await sql`
    SELECT id, name, nit, address, contact_email, contact_phone, created_at
    FROM businesses WHERE owner_id = ${ownerId}
    ORDER BY created_at ASC LIMIT 1
  `;
  return (rows[0] as Business) ?? null;
}

export async function getItems(businessId: string): Promise<ItemRow[]> {
  const rows = await sql`
    SELECT id, business_id, name, unit, current_stock, unit_cost, image_url, created_at
    FROM items WHERE business_id = ${businessId} ORDER BY name ASC
  `;
  return rows as ItemRow[];
}

export async function getItemById(itemId: string, businessId: string): Promise<ItemRow | null> {
  const rows = await sql`
    SELECT id, business_id, name, unit, current_stock, unit_cost, image_url, created_at
    FROM items WHERE id = ${itemId} AND business_id = ${businessId} LIMIT 1
  `;
  return (rows[0] as ItemRow) ?? null;
}

export async function getItemStats(businessId: string): Promise<ItemStats> {
  const rows = await sql`
    SELECT COUNT(*)::int AS item_count,
           COALESCE(SUM(current_stock * unit_cost), 0)::numeric AS stock_value
    FROM items WHERE business_id = ${businessId}
  `;
  return (rows[0] as ItemStats) ?? { item_count: 0, stock_value: "0" };
}

export async function getProductCount(businessId: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int AS count
    FROM products p JOIN stores s ON s.id = p.store_id
    WHERE s.business_id = ${businessId} AND p.is_active = true
  `;
  return (rows[0] as { count: number } | undefined)?.count ?? 0;
}

export async function getStoreCount(businessId: string): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int AS count
    FROM stores WHERE business_id = ${businessId} AND is_active = true
  `;
  return (rows[0] as { count: number } | undefined)?.count ?? 0;
}

/* ---------- orders ---------- */

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderRow = {
  id: string;
  user_id: string;
  store_id: string;
  status: OrderStatus;
  subtotal: string;
  tax: string;
  total: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  store_name: string;
  line_count: number;
};

export type OrderLineRow = {
  id: string;
  product_id: string;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  unit_price: string;
  line_total: string;
};

export type OrderWithLines = OrderRow & { lines: OrderLineRow[] };

export async function getOrders(
  businessId: string,
  status?: OrderStatus
): Promise<OrderRow[]> {
  const rows = status
    ? await sql`
        SELECT o.id, o.user_id, o.store_id, o.status,
               o.subtotal, o.tax, o.total, o.created_at, o.updated_at,
               u.name AS customer_name, u.email AS customer_email,
               s.name AS store_name,
               (SELECT COUNT(*)::int FROM order_lines ol WHERE ol.order_id = o.id) AS line_count
        FROM orders o
        JOIN stores s ON s.id = o.store_id
        JOIN users u ON u.id = o.user_id
        WHERE s.business_id = ${businessId}
          AND o.status = ${status}
        ORDER BY o.created_at DESC
      `
    : await sql`
        SELECT o.id, o.user_id, o.store_id, o.status,
               o.subtotal, o.tax, o.total, o.created_at, o.updated_at,
               u.name AS customer_name, u.email AS customer_email,
               s.name AS store_name,
               (SELECT COUNT(*)::int FROM order_lines ol WHERE ol.order_id = o.id) AS line_count
        FROM orders o
        JOIN stores s ON s.id = o.store_id
        JOIN users u ON u.id = o.user_id
        WHERE s.business_id = ${businessId}
        ORDER BY o.created_at DESC
      `;
  return rows as OrderRow[];
}

export async function getOrderById(
  orderId: string,
  businessId: string
): Promise<OrderWithLines | null> {
  const rows = await sql`
    SELECT o.id, o.user_id, o.store_id, o.status,
           o.subtotal, o.tax, o.total, o.created_at, o.updated_at,
           u.name AS customer_name, u.email AS customer_email,
           s.name AS store_name,
           0 AS line_count
    FROM orders o
    JOIN stores s ON s.id = o.store_id
    JOIN users u ON u.id = o.user_id
    WHERE o.id = ${orderId}
      AND s.business_id = ${businessId}
    LIMIT 1
  `;
  const order = rows[0] as OrderRow | undefined;
  if (!order) return null;

  const lines = await sql`
    SELECT ol.id, ol.product_id, p.name AS product_name, p.image_url AS product_image_url,
           ol.quantity, ol.unit_price, ol.line_total
    FROM order_lines ol
    JOIN products p ON p.id = ol.product_id
    WHERE ol.order_id = ${orderId}
    ORDER BY ol.created_at ASC
  `;

  return {
    ...order,
    line_count: lines.length,
    lines: lines as OrderLineRow[],
  };
}

export type OrderStats = {
  total_count: number;
  pending_count: number;
  paid_count: number;
  revenue: string;
};

export async function getOrderStats(businessId: string): Promise<OrderStats> {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total_count,
      COUNT(*) FILTER (WHERE o.status = 'PENDING')::int AS pending_count,
      COUNT(*) FILTER (WHERE o.status = 'PAID')::int AS paid_count,
      COALESCE(SUM(o.total) FILTER (WHERE o.status IN ('PAID','SHIPPED','DELIVERED')), 0)::numeric AS revenue
    FROM orders o
    JOIN stores s ON s.id = o.store_id
    WHERE s.business_id = ${businessId}
  `;
  return (
    (rows[0] as OrderStats) ?? {
      total_count: 0,
      pending_count: 0,
      paid_count: 0,
      revenue: "0",
    }
  );
}