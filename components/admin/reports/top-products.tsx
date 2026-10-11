import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { TopProduct } from "@/lib/queries";

export function TopProducts({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-muted py-6 text-center text-sm">
        No sales yet. Once orders come in, your best sellers show up here.
      </p>
    );
  }

  return (
    <ul className="divide-line divide-y">
      {products.map((p, i) => (
        <li
          key={p.product_id}
          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span
            aria-hidden
            className="num bg-brand-soft text-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <Link
              href={`/admin/products/${p.product_id}/edit`}
              className="text-content hover:text-brand truncate text-sm font-medium"
            >
              {p.product_name}
            </Link>
            <p className="text-muted text-xs">
              {p.store_name} · {formatNumber(p.units_sold)} sold
            </p>
          </div>
          <p className="num text-content shrink-0 text-sm font-semibold">
            {formatCurrency(p.revenue)}
          </p>
        </li>
      ))}
    </ul>
  );
}
