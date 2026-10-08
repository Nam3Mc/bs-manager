import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getItems } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { ItemsTable } from "@/components/admin/items/items-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Items" };

export default async function ItemsPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const items = await getItems(business.id);

  return (
    <>
      <PageHeader
        title="Items"
        description="Raw ingredients and materials. Products are built from these."
        action={
          <Link href="/admin/items/new">
            <Button variant="primary" size="md">
              <PlusIcon />
              Add item
            </Button>
          </Link>
        }
      />
      <ItemsTable items={items} />
    </>
  );
}