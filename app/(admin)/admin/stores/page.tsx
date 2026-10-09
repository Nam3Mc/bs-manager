import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getBusinessForOwner, getStoresForBusiness } from "@/lib/queries";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Stores" };

export default async function StoresPage() {
  const session = await requireRole("ADMIN");
  const business = await getBusinessForOwner(session.userId);
  if (!business) redirect("/admin/dashboard");

  const stores = await getStoresForBusiness(business.id);

  return (
    <>
      <PageHeader
        title="Stores"
        description="Your storefronts. Full theming and customization coming next."
        action={
          <Link href="/admin/stores/new">
            <Button variant="primary" size="md">
              <PlusIcon />
              New store
            </Button>
          </Link>
        }
      />

      {stores.length === 0 ? (
        <EmptyState
          title="No stores yet"
          description="Create a store to publish your products to customers."
          action={
            <Link href="/admin/stores/new">
              <Button variant="primary" size="md">
                Create store
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <Card key={s.id}>
              <CardBody>
                <p className="font-display text-lg font-semibold text-content">{s.name}</p>
                <p className="mt-1 font-mono text-xs text-subtle">/{s.slug}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}