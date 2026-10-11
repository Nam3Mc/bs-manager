import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getCartLines, getCartSummary } from "@/lib/queries";
import { CartTotals } from "@/components/market/cart/cart-totals";
import { PlaceOrderButton } from "@/components/market/checkout/place-order-button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeftIcon } from "@/components/market/icons";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await requireRole("CLIENT");
  const [lines, summary] = await Promise.all([
    getCartLines(session.userId),
    getCartSummary(session.userId),
  ]);

  if (lines.length === 0) {
    redirect("/market/cart");
  }

  const byStore = new Map<string, typeof lines>();
  for (const line of lines) {
    const arr = byStore.get(line.store_id) ?? [];
    arr.push(line);
    byStore.set(line.store_id, arr);
  }

  const TAX_RATE = 0.08;
  const subtotalNum = Number(summary.subtotal);
  const tax = subtotalNum * TAX_RATE;
  const total = subtotalNum + tax;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/market/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-content"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-content">
        Checkout
      </h1>
      <p className="mb-8 text-sm text-muted">
        Review your order, then place it. Payment is simulated in this build.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Order preview */}
        <div className="space-y-4">
          {Array.from(byStore.entries()).map(([storeId, storeLines]) => {
            const storeName = storeLines[0].store_name;
            const storeSubtotal = storeLines.reduce(
              (sum, l) => sum + Number(l.price) * l.quantity,
              0
            );
            return (
              <Card key={storeId}>
                <CardHeader>
                  <div className="flex items-baseline justify-between">
                    <CardTitle className="text-base">{storeName}</CardTitle>
                    <span className="num text-xs text-muted">
                      {formatCurrency(storeSubtotal)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-subtle">
                    Ships as a separate order
                  </p>
                </CardHeader>
                <CardBody className="pt-3">
                  <ul className="divide-y divide-line">
                    {storeLines.map((line) => (
                      <li
                        key={line.id}
                        className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0 text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="num text-xs text-subtle">
                            {line.quantity}×
                          </span>
                          <span className="truncate text-content">
                            {line.product_name}
                          </span>
                        </div>
                        <span className="num shrink-0 text-content">
                          {formatCurrency(
                            Number(line.price) * line.quantity
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Total + place order */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Order total</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 pt-4">
              <CartTotals subtotal={summary.subtotal} />
              <PlaceOrderButton />
              <p className="text-center text-xs text-subtle">
                By placing the order you agree to pick up at the store address.
                Payment collection is handled by the store.
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </main>
  );
}