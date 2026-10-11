import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getItems, getStoresForBusiness } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const [stores, items] = await Promise.all([
    getStoresForBusiness(business.id),
    getItems(business.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="New product"
        description="Define a sellable SKU and its recipe."
      />
      <Card>
        <CardBody>
          <ProductForm
            stores={stores}
            availableItems={items.map((i) => ({
              id: i.id,
              name: i.name,
              unit: i.unit,
              unit_cost: i.unit_cost,
            }))}
          />
        </CardBody>
      </Card>
    </div>
  );
}
