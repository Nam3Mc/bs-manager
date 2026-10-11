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
                    <div className="num text-content shrink-0 text-sm font-medium">
                      {formatCurrency(line.line_total)}
                    </div>
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
              <p className="text-subtle mt-2 text-xs">
                Updates instantly. Customer sees the change on their order history.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardBody className="pt-4 text-sm">
              <p className="text-content font-medium">{order.customer_name}</p>
              <p className="text-muted mt-0.5">{order.customer_email}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store</CardTitle>
            </CardHeader>
            <CardBody className="pt-4 text-sm">
              <p className="text-content font-medium">{order.store_name}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/orders"
          className="text-brand hover:text-brand-hover text-sm font-medium"
        >
          ← Back to orders
        </Link>
      </div>
    </div>
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
