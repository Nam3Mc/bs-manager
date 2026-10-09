import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ProductRow } from "@/lib/queries";
import { DeleteProductButton } from "./delete-product-button";

export function ProductsTable({ products }: { products: ProductRow[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Create a sellable SKU from the items you have in stock."
        action={
          <Link href="/admin/products/new">
            <Button variant="primary" size="md">
              Create product
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="hidden md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-sunken text-left text-xs font-medium uppercase tracking-wider text-subtle">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Store</th>
              <th className="px-5 py-3 text-right">Cost</th>
              <th className="px-5 py-3 text-right">Price</th>
              <th className="px-5 py-3 text-right">Margin</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const cost = Number(p.derived_cost);
              const price = Number(p.price);
              const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
              return (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-hover">
                  <td className="px-5 py-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-content hover:text-brand">
                      {p.name}
                    </Link>
                    {p.recipe_count > 0 && (
                      <div className="text-xs text-subtle">{p.recipe_count} item{p.recipe_count === 1 ? "" : "s"} in recipe</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted">{p.store_name}</td>
                  <td className="num px-5 py-3 text-right text-muted">{formatCurrency(cost)}</td>
                  <td className="num px-5 py-3 text-right font-medium text-content">{formatCurrency(price)}</td>
                  <td className={`num px-5 py-3 text-right ${margin < 0 ? "text-danger" : margin < 20 ? "text-warning" : "text-success"}`}>
                    {price > 0 ? `${margin.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {p.is_active ? (
                      <span className="inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Active</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-ink-500/10 px-2 py-0.5 text-xs font-medium text-muted">Inactive</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:bg-hover hover:text-content">
                        Edit
                      </Link>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {products.map((p) => {
          const cost = Number(p.derived_cost);
          const price = Number(p.price);
          const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
          return (
            <li key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/products/${p.id}/edit`} className="truncate font-medium text-content">
                    {p.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span className="num font-medium text-content">{formatCurrency(price)}</span>
                    <span aria-hidden>·</span>
                    <span className={`num ${margin < 0 ? "text-danger" : margin < 20 ? "text-warning" : "text-success"}`}>
                      {price > 0 ? `${margin.toFixed(1)}%` : "—"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-subtle">{p.store_name}</div>
                </div>
                <DeleteProductButton productId={p.id} productName={p.name} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}