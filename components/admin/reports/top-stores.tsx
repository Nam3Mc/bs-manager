import { formatCurrency, formatNumber } from "@/lib/utils";
import type { StoreRevenue } from "@/lib/queries";

export function TopStores({ stores }: { stores: StoreRevenue[] }) {
  if (stores.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        You haven&apos;t created a store yet.
      </p>
    );
  }

  const max = Math.max(...stores.map((s) => Number(s.revenue)), 1);

  return (
    <ul className="space-y-3">
      {stores.map((s) => {
        const pct = (Number(s.revenue) / max) * 100;
        return (
          <li key={s.store_id}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-sm font-medium text-content">{s.store_name}</p>
              <p className="num shrink-0 text-sm font-semibold text-content">
                {formatCurrency(s.revenue)}
              </p>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-sunken">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-subtle">
              {formatNumber(s.orders)} order{s.orders === 1 ? "" : "s"}
            </p>
          </li>
        );
      })}
    </ul>
  );
}