import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getItemById } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { ItemForm } from "@/components/admin/items/item-form";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = { title: "Edit item" };

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const item = await getItemById(id, business.id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit item" description={`Update ${item.name}`} />
      <Card>
        <CardBody>
          <ItemForm
            itemId={item.id}
            defaultValues={{
              name: item.name,
              unit: item.unit,
              currentStock: item.current_stock,
              unitCost: item.unit_cost,
              imageUrl: item.image_url,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
