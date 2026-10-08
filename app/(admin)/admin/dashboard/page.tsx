import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/session";
import {
  getBusinessForOwner,
  getItemStats,
  getProductCount,
  getStoreCount,
  getItems,
} from "@/lib/queries";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { BusinessSetupForm } from "@/components/admin/business-setup-form";
import { BoxIcon, TagIcon, StoreIcon, ChartIcon } from "@/components/admin/icons";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);

  // First-run: no business yet
  if (!business) return <FirstRunView name={session.name} />;

  const [itemStats, productCount, storeCount, items] = await Promise.all([
    getItemStats(business.id),
    getProductCount(business.id),
    getStoreCount(business.id),
    getItems(business.id),
  ]);
  const recentItems = items.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Overview of ${business.name}`}
        action={
          <Link href="/admin/items/new">
            <Button variant="primary" size="md">
              Add item
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Items"
          value={formatNumber(itemStats.item_count)}
          hint="Raw ingredients in stock"
          icon={<BoxIcon />}
          href="/admin/items"
          accent
        />
        <StatCard
          label="Products"
          value={formatNumber(productCount)}
          hint="Sellable SKUs across stores"
          icon={<TagIcon />}
          href="/admin/products"
        />
        <StatCard
          label="Stores"
          value={formatNumber(storeCount)}
          hint="Published storefronts"
          icon={<StoreIcon />}
          href="/admin/stores"
        />
        <StatCard
          label="Stock value"
          value={formatCurrency(itemStats.stock_value)}
          hint="Sum of current stock × cost"
          icon={<ChartIcon />}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent items</CardTitle>
              <Link
                href="/admin/items"
                className="text-xs font-medium text-brand hover:text-brand-hover"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            {recentItems.length === 0 ? (
              <EmptyState
                title="No items yet"
                description="Add your first ingredient to start building products."
                action={
                  <Link href="/admin/items/new">
                    <Button variant="primary" size="md">
                      Add item
                    </Button>
                  </Link>
                }
                className="border-none bg-transparent p-6"
              />
            ) : (
              <ul className="divide-y divide-line">
                {recentItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="truncate text-sm font-medium text-content hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {item.current_stock} {item.unit.toLowerCase()}
                      </p>
                    </div>
                    <div className="num text-sm text-muted">
                      {formatCurrency(item.unit_cost)}
                      <span className="ml-1 text-xs text-subtle">
                        / {item.unit.toLowerCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="flex flex-col gap-2">
              <QuickAction href="/admin/items/new" label="Add a new item" />
              <QuickAction href="/admin/products/new" label="Create a product" />
              <QuickAction href="/admin/stores/new" label="Publish a store" />
              <QuickAction href="/admin/reports" label="View reports" />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

/* ---------- First-run view (no business yet) ---------- */

function FirstRunView({ name }: { name: string }) {
  const firstName = name.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="rounded-2xl border border-line bg-raised p-8 shadow-sm">
        <span
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand"
        >
          <StoreIcon className="h-6 w-6" />
        </span>

        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-content">
          Welcome, {firstName}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Set up your business to start adding items, building products, and
          publishing your storefront.
        </p>

        <div className="mt-6">
          <BusinessSetupForm />
        </div>
      </div>
    </div>
  );
}

/* ---------- Local helpers ---------- */

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-content transition-colors duration-150 ease-out hover:bg-hover"
    >
      <span>{label}</span>
      <span aria-hidden className="text-subtle">
        →
      </span>
    </Link>
  );
}