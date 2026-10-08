import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getOrderById } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { OrderStatusSelect } from "@/components/admin/orders/order-status-select";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const order = await getOrderById(id, business.id);
  if (!order) notFound();

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={`Order #${shortId}`}
        description={`Placed ${formatDateTime(order.created_at)}`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardBody className="pt-4">
              <ul className="divide-y divide-line">
                {order.lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-content">
                        {line.product_name}
                      </p>
                      <p className="num text-xs text-muted">
                        {formatCurrency(line.unit_price)} × {line.quantity}
                      </p>
                    </div>
                    <div className="num shrink-0 text-sm font-medium text-content">
                      {formatCurrency(line.line_total)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
                <Row label="Tax" value={formatCurrency(order.tax)} />
                <div className="flex items-center justify-between border-t border-line pt-2 text-base font-semibold text-content">
                  <span>Total</span>
                  <span className="num">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardBody className="pt-4">
              <div className="mb-3">
                <OrderStatusBadge status={order.status} />
              </div>
              <OrderStatusSelect orderId={order.id} current={order.status} />
              <p className="mt-2 text-xs text-subtle">
                Updates instantly. Customer sees the change on their order
                history.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardBody className="pt-4 text-sm">
              <p className="font-medium text-content">{order.customer_name}</p>
              <p className="mt-0.5 text-muted">{order.customer_email}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store</CardTitle>
            </CardHeader>
            <CardBody className="pt-4 text-sm">
              <p className="font-medium text-content">{order.store_name}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-brand hover:text-brand-hover"
        >
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted">
      <span>{label}</span>
      <span className="num">{value}</span>
    </div>
  );
}