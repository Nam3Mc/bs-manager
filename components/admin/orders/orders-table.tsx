import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { formatCurrency } from "@/lib/utils";
import type { OrderRow } from "@/lib/queries";

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

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When customers place orders from your storefronts, they'll show up here."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-sunken text-left text-xs font-medium uppercase tracking-wider text-subtle">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Store</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3 text-right">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-line last:border-0 hover:bg-hover"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-mono text-xs font-medium text-content hover:text-brand"
                  >
                    #{shortId(o.id)}
                  </Link>
                  <div className="text-xs text-subtle">{formatDate(o.created_at)}</div>
                </td>
                <td className="px-5 py-3">
                  <div className="font-medium text-content">{o.customer_name}</div>
                  <div className="text-xs text-muted">{o.customer_email}</div>
                </td>
                <td className="px-5 py-3 text-muted">{o.store_name}</td>
                <td className="px-5 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="num px-5 py-3 text-right font-medium text-content">
                  {formatCurrency(o.total)}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:bg-hover hover:text-content"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="divide-y divide-line md:hidden">
        {orders.map((o) => (
          <li key={o.id} className="p-4">
            <Link href={`/admin/orders/${o.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-xs font-medium text-content">
                    #{shortId(o.id)}
                  </div>
                  <div className="mt-1 truncate text-sm text-content">
                    {o.customer_name}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">
                    {o.store_name} · {formatDate(o.created_at)}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <OrderStatusBadge status={o.status} />
                  <div className="num text-sm font-medium text-content">
                    {formatCurrency(o.total)}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}