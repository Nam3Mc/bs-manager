import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getCartLines, getCartSummary } from "@/lib/queries";
import { CartLine } from "@/components/market/cart/cart-line";
import { CartTotals } from "@/components/market/cart/cart-totals";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/market/icons";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const session = await requireRole("CLIENT");
  const [lines, summary] = await Promise.all([
    getCartLines(session.userId),
    getCartSummary(session.userId),
  ]);

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-content mb-6 text-3xl font-bold tracking-tight">
          Your cart
        </h1>
        <EmptyState
          title="Your cart is empty"
          description="Browse the marketplace and add products to get started."
          action={
            <Link href="/market">
              <Button variant="primary" size="md">
                Browse stores
              </Button>
            </Link>
          }
        />
      </main>
    );
  }

  // Group lines by store for display
  const byStore = new Map<string, typeof lines>();
  for (const line of lines) {
    const arr = byStore.get(line.store_id) ?? [];
    arr.push(line);
    byStore.set(line.store_id, arr);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/market"
        className="text-muted hover:text-content mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Continue shopping
      </Link>

      <h1 className="font-display text-content mb-2 text-3xl font-bold tracking-tight">
        Your cart
      </h1>
      <p className="text-muted mb-8 text-sm">
        {summary.item_count} item{summary.item_count === 1 ? "" : "s"} from{" "}
        {summary.store_count} store{summary.store_count === 1 ? "" : "s"}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Lines */}
        <div className="space-y-4">
          {Array.from(byStore.entries()).map(([storeId, storeLines]) => {
            const storeName = storeLines[0].store_name;
            const storeSlug = storeLines[0].store_slug;
            return (
              <Card key={storeId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/market/${storeSlug}`}
                      className="font-display text-content hover:text-brand text-base font-semibold"
                    >
                      {storeName}
                    </Link>
                    <Link
                      href={`/market/${storeSlug}`}
                      className="text-brand hover:text-brand-hover text-xs font-medium"
                    >
                      Visit store
                    </Link>
                  </div>
                </CardHeader>
                <CardBody className="pt-2">
                  <ul className="divide-line divide-y">
                    {storeLines.map((line) => (
                      <CartLine key={line.id} line={line} />
                    ))}
                  </ul>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 pt-4">
              <CartTotals subtotal={summary.subtotal} />
              <Link href="/market/checkout" className="block">
                <Button variant="accent" size="lg" className="w-full">
                  Proceed to checkout
                </Button>
              </Link>
              <p className="text-subtle text-center text-xs">
                Tax and totals recalculated at checkout.
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </main>
  );
}
