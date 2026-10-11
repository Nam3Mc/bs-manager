import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getClientOrderById } from "@/lib/queries";
import { OrderStatusBadge } from "@/components/market/orders/order-status-badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeftIcon } from "@/components/market/icons";

export const metadata: Metadata = { title: "Order" };

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function ClientOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("CLIENT");
  const order = await getClientOrderById(id, session.userId);
  if (!order) notFound();

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/market/orders"
        className="text-muted hover:text-content mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All orders
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-content text-3xl font-bold tracking-tight">
            Order #{shortId}
          </h1>
          <p className="text-muted mt-1 text-sm">
            Placed {formatDateTime(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-base">{order.store_name}</CardTitle>
            <Link
              href={`/market`}
              className="text-brand hover:text-brand-hover text-xs font-medium"
            >
              Visit store
            </Link>
          </div>
        </CardHeader>
        <CardBody className="pt-3">
          <ul className="divide-line divide-y">
            {order.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-content truncate text-sm font-medium">
                    {line.product_name}
                  </p>
                  <p className="num text-muted text-xs">
                    {formatCurrency(line.unit_price)} × {line.quantity}
                  </p>
                </div>
                <span className="num text-content shrink-0 text-sm font-medium">
                  {formatCurrency(line.line_total)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            <Row label="Tax" value={formatCurrency(order.tax)} />
            <div className="border-line text-content flex items-center justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="num">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <p className="text-subtle mt-6 text-center text-xs">
        Updates from the store will appear here.
      </p>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-muted flex items-center justify-between">
      <span>{label}</span>
      <span className="num">{value}</span>
    </div>
  );
}
