import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import {
  getBusinessForOwner,
  getRevenueSummary,
  getDailyRevenue,
  getTopProducts,
  getStoreRevenue,
  getLowStockItems,
} from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueSummary } from "@/components/admin/reports/revenue-summary";
import { SalesChart } from "@/components/admin/reports/sales-chart";
import { TopProducts } from "@/components/admin/reports/top-products";
import { TopStores } from "@/components/admin/reports/top-stores";
import { LowStock } from "@/components/admin/reports/low-stock";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const [summary, daily, topProducts, storeRevenue, lowStock] = await Promise.all([
    getRevenueSummary(business.id),
    getDailyRevenue(business.id, 30),
    getTopProducts(business.id, 5),
    getStoreRevenue(business.id),
    getLowStockItems(business.id, 10),
  ]);

  return (
    <>
      <PageHeader
        title="Reports"
        description={`Sales and inventory insights for ${business.name}`}
      />

      <RevenueSummary {...summary} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales</CardTitle>
          </CardHeader>
          <CardBody>
            <SalesChart data={daily} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low stock</CardTitle>
          </CardHeader>
          <CardBody className="pt-3">
            <LowStock items={lowStock} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardBody className="pt-3">
            <TopProducts products={topProducts} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by store</CardTitle>
          </CardHeader>
          <CardBody className="pt-3">
            <TopStores stores={storeRevenue} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}