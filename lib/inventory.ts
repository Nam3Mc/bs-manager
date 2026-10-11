import { sql } from "@/lib/db";

interface ProductQuantity {
  productId: string;
  quantity: number;
}

/**
 * Aggregate the raw item quantities required to fulfill a set of products.
 * Products with no recipe contribute nothing (passthrough SKUs).
 */
async function computeRequiredItems(
  productQuantities: ProductQuantity[]
): Promise<Map<string, number>> {
  const needed = new Map<string, number>();
  if (productQuantities.length === 0) return needed;

  const productIds = productQuantities.map((p) => p.productId);
  const rows = await sql`
    SELECT product_id, item_id, quantity
    FROM product_items
    WHERE product_id = ANY(${productIds}::uuid[])
  `;

  const qtyByProduct = new Map(
    productQuantities.map((p) => [p.productId, p.quantity])
  );

  for (const row of rows) {
    const productId = row.product_id as string;
    const itemId = row.item_id as string;
    const recipeQty = Number(row.quantity);
    const orderQty = qtyByProduct.get(productId) ?? 0;
    if (orderQty <= 0) continue;
    needed.set(itemId, (needed.get(itemId) ?? 0) + recipeQty * orderQty);
  }

  return needed;
}

/**
 * Decrement current_stock for every item that goes into the given products.
 * Returns an error string if any item is short — in which case nothing is changed.
 */
export async function reserveStock(
  productQuantities: ProductQuantity[]
): Promise<{ error?: string }> {
  const needed = await computeRequiredItems(productQuantities);
  if (needed.size === 0) return {}; // no recipes → nothing to reserve

  const itemIds = Array.from(needed.keys());

  const items = await sql`
    SELECT id, name, current_stock
    FROM items
    WHERE id = ANY(${itemIds}::uuid[])
  `;

  const insufficient: string[] = [];
  for (const item of items) {
    const itemId = item.id as string;
    const required = needed.get(itemId)!;
    const available = Number(item.current_stock);
    if (available < required) {
      insufficient.push(
        `${item.name as string} (need ${required}, have ${available})`
      );
    }
  }

  if (insufficient.length > 0) {
    return { error: `Insufficient stock: ${insufficient.join("; ")}` };
  }

  try {
    // Atomic batch. The CHECK (current_stock >= 0) constraint on the
    // items table guards against a race with another concurrent sale.
    await sql.transaction(
      itemIds.map((itemId) => {
        const qty = needed.get(itemId)!;
        return sql`
          UPDATE items
          SET current_stock = current_stock - ${qty}
          WHERE id = ${itemId}
        `;
      })
    );
  } catch (err) {
    console.error("[reserveStock] apply", err);
    return { error: "Failed to reserve stock. Please try again." };
  }

  return {};
}

/**
 * Increment current_stock back. Used when an order is cancelled.
 * Never fails on shortage — this is the reverse direction.
 */
export async function releaseStock(
  productQuantities: ProductQuantity[]
): Promise<void> {
  const needed = await computeRequiredItems(productQuantities);
  if (needed.size === 0) return;

  const itemIds = Array.from(needed.keys());

  try {
    await sql.transaction(
      itemIds.map((itemId) => {
        const qty = needed.get(itemId)!;
        return sql`
          UPDATE items
          SET current_stock = current_stock + ${qty}
          WHERE id = ${itemId}
        `;
      })
    );
  } catch (err) {
    console.error("[releaseStock] apply", err);
  }
}