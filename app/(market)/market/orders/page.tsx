import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getClientOrders } from "@/lib/queries";
import { OrderStatusBadge } from "@/components/market/orders/order-status-badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CheckIcon } from "@/components/market/icons";

export const metadata: Metadata = { title: "My orders" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ placed?: string }>;
}) {
  const session = await requireRole("CLIENT");
  const { placed } = await searchParams;
  const placedCount = placed ? Number(placed) : 0;

  const orders = await getClientOrders(session.userId);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {placedCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-white"
          >
            <CheckIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-content">
              Order{placedCount === 1 ? "" : "s"} placed
            </p>
            <p className="text-xs text-muted">
              {placedCount === 1
                ? "The store will confirm shortly."
                : `${placedCount} orders placed. Each store will confirm separately.`}
            </p>
          </div>
        </div>
      )}

      <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-content">
        My orders
      </h1>
      <p className="mb-8 text-sm text-muted">
        {orders.length === 0
          ? "You haven't placed any orders yet."
          : `${orders.length} order${orders.length === 1 ? "" : "s"} total.`}
      </p>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Browse the marketplace and place your first order."
          action={
            <Link href="/market">
              <Button variant="primary" size="md">
                Browse stores
              </Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/market/orders/${o.id}`}
                  className="flex items-center justify-between gap-4 p-5 transition-colors duration-150 hover:bg-hover"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-content">
                        #{shortId(o.id)}
                      </span>
                      <span className="text-xs text-subtle">
                        {formatDate(o.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-content">
                      {o.store_name}
                    </p>
                    <p className="text-xs text-muted">
                      {o.line_count} item{o.line_count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <OrderStatusBadge status={o.status} />
                    <span className="num text-sm font-semibold text-content">
                      {formatCurrency(o.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}