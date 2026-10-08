import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import {
  getBusinessForOwner,
  getOrders,
  getOrderStats,
  type OrderStatus,
} from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { ReceiptIcon, BoxIcon, ChartIcon } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Orders" };

const FILTERS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const { status: statusParam } = await searchParams;
  const currentFilter =
    statusParam &&
    ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(statusParam)
      ? (statusParam as OrderStatus)
      : "ALL";

  const [orders, stats] = await Promise.all([
    getOrders(business.id, currentFilter === "ALL" ? undefined : currentFilter),
    getOrderStats(business.id),
  ]);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Customer orders across all your stores."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total orders"
          value={formatNumber(stats.total_count)}
          hint="All time"
          icon={<ReceiptIcon />}
          accent
        />
        <StatCard
          label="Pending"
          value={formatNumber(stats.pending_count)}
          hint="Awaiting action"
          icon={<BoxIcon />}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          hint="Paid, shipped, delivered"
          icon={<ChartIcon />}
        />
      </div>

      <div className="mt-6 mb-4 flex flex-wrap gap-1">
        {FILTERS.map((f) => {
          const active = f.value === currentFilter;
          const href =
            f.value === "ALL" ? "/admin/orders" : `/admin/orders?status=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out",
                active
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-hover hover:text-content"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <OrdersTable orders={orders} />
    </>
  );
}