import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { TopProduct } from "@/lib/queries";

export function TopProducts({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        No sales yet. Once orders come in, your best sellers show up here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {products.map((p, i) => (
        <li key={p.product_id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span
            aria-hidden
            className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-semibold text-brand"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <Link
              href={`/admin/products/${p.product_id}/edit`}
              className="truncate text-sm font-medium text-content hover:text-brand"
            >
              {p.product_name}
            </Link>
            <p className="text-xs text-muted">
              {p.store_name} · {formatNumber(p.units_sold)} sold
            </p>
          </div>
          <p className="num shrink-0 text-sm font-semibold text-content">
            {formatCurrency(p.revenue)}
          </p>
        </li>
      ))}
    </ul>
  );
}