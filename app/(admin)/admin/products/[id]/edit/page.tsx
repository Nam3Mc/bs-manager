import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import {
  getBusinessForOwner,
  getItems,
  getProductById,
  getStoresForBusiness,
} from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const [product, stores, items] = await Promise.all([
    getProductById(id, business.id),
    getStoresForBusiness(business.id),
    getItems(business.id),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit product" description={`Update ${product.name}`} />
      <Card>
        <CardBody>
          <ProductForm
            productId={product.id}
            stores={stores}
            availableItems={items.map((i) => ({
              id: i.id,
              name: i.name,
              unit: i.unit,
              unit_cost: i.unit_cost,
            }))}
            defaultValues={{
              storeId: product.store_id,
              name: product.name,
              description: product.description,
              price: product.price,
              imageUrl: product.image_url,
              isActive: product.is_active,
              recipe: product.recipe.map((r) => ({
                itemId: r.item_id,
                quantity: r.quantity,
              })),
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}