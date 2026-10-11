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
            <tr className="border-line bg-sunken text-subtle border-b text-left text-xs font-medium tracking-wider uppercase">
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
                <tr
                  key={p.id}
                  className="border-line hover:bg-hover border-b last:border-0"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-content hover:text-brand font-medium"
                    >
                      {p.name}
                    </Link>
                    {p.recipe_count > 0 && (
                      <div className="text-subtle text-xs">
                        {p.recipe_count} item{p.recipe_count === 1 ? "" : "s"} in recipe
                      </div>
                    )}
                  </td>
                  <td className="text-muted px-5 py-3">{p.store_name}</td>
                  <td className="num text-muted px-5 py-3 text-right">
                    {formatCurrency(cost)}
                  </td>
                  <td className="num text-content px-5 py-3 text-right font-medium">
                    {formatCurrency(price)}
                  </td>
                  <td
                    className={`num px-5 py-3 text-right ${margin < 0 ? "text-danger" : margin < 20 ? "text-warning" : "text-success"}`}
                  >
                    {price > 0 ? `${margin.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {p.is_active ? (
                      <span className="bg-success/10 text-success inline-flex rounded-full px-2 py-0.5 text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="bg-ink-500/10 text-muted inline-flex rounded-full px-2 py-0.5 text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-muted hover:bg-hover hover:text-content rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                      >
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

      <ul className="divide-line divide-y md:hidden">
        {products.map((p) => {
          const cost = Number(p.derived_cost);
          const price = Number(p.price);
          const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
          return (
            <li key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-content truncate font-medium"
                  >
                    {p.name}
                  </Link>
                  <div className="text-muted mt-1 flex items-center gap-2 text-xs">
                    <span className="num text-content font-medium">
                      {formatCurrency(price)}
                    </span>
                    <span aria-hidden>·</span>
                    <span
                      className={`num ${margin < 0 ? "text-danger" : margin < 20 ? "text-warning" : "text-success"}`}
                    >
                      {price > 0 ? `${margin.toFixed(1)}%` : "—"}
                    </span>
                  </div>
                  <div className="text-subtle mt-0.5 text-xs">{p.store_name}</div>
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
