import type { Metadata } from "next";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/admin/page-header";
import { ItemForm } from "@/components/admin/items/item-form";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = { title: "New item" };

export default async function NewItemPage() {
  await requireRole("ADMIN");
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New item" description="Add a raw ingredient to your business inventory." />
      <Card>
        <CardBody>
          <ItemForm />
        </CardBody>
      </Card>
    </div>
  );
}