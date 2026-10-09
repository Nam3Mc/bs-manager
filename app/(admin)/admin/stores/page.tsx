import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getFullStores } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { StoresGrid } from "@/components/admin/stores/stores-grid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Stores" };

export default async function StoresPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const stores = await getFullStores(business.id);

  return (
    <>
      <PageHeader
        title="Stores"
        description="Your storefronts. Each has its own theme and product catalog."
        action={
          <Link href="/admin/stores/new">
            <Button variant="primary" size="md">
              <PlusIcon />
              New store
            </Button>
          </Link>
        }
      />
      <StoresGrid stores={stores} />
    </>
  );
}