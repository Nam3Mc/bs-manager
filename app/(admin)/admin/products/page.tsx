import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getProducts, getProductStats } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ProductsTable } from "@/components/admin/products/products-table";
import { Button } from "@/components/ui/button";
import { PlusIcon, TagIcon, ChartIcon } from "@/components/admin/icons";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const [products, stats] = await Promise.all([
    getProducts(business.id),
    getProductStats(business.id),
  ]);

  return (
    <>
      <PageHeader
        title="Products"
        description="Sellable SKUs built from your items."
        action={
          <Link href="/admin/products/new">
            <Button variant="primary" size="md">
              <PlusIcon />
              Create product
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total products" value={formatNumber(stats.total_count)} hint="All SKUs" icon={<TagIcon />} accent />
        <StatCard label="Active" value={formatNumber(stats.active_count)} hint="Visible to customers" />
        <StatCard label="Avg margin" value={`${Number(stats.avg_margin).toFixed(1)}%`} hint="Across all products" icon={<ChartIcon />} />
      </div>

      <div className="mt-6">
        <ProductsTable products={products} />
      </div>
    </>
  );
}