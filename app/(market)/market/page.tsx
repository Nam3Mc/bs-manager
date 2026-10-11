import type { Metadata } from "next";
import { requireRole } from "@/lib/session";
import { getPublicStores } from "@/lib/queries";
import { StoreCard } from "@/components/market/store-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Marketplace" };

export default async function MarketPage() {
  const session = await requireRole("CLIENT");
  const stores = await getPublicStores();

  const firstName = session.name.split(" ")[0] || "there";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-content sm:text-4xl">
          Hi {firstName}, what&apos;s for today?
        </h1>
        <p className="mt-2 text-muted">
          {stores.length === 0
            ? "No stores are open yet."
            : `${stores.length} store${stores.length === 1 ? "" : "s"} open near you.`}
        </p>
      </div>

      {stores.length === 0 ? (
        <EmptyState
          title="No stores yet"
          description="Once businesses publish their storefronts, they'll appear here."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <li key={store.id}>
              <StoreCard store={store} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}