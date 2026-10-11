import { formatCurrency, formatNumber } from "@/lib/utils";
import type { StoreRevenue } from "@/lib/queries";

export function TopStores({ stores }: { stores: StoreRevenue[] }) {
  if (stores.length === 0) {
    return (
      <p className="text-muted py-6 text-center text-sm">
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
              <p className="text-content truncate text-sm font-medium">{s.store_name}</p>
              <p className="num text-content shrink-0 text-sm font-semibold">
                {formatCurrency(s.revenue)}
              </p>
            </div>
            <div className="bg-sunken mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-brand h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <p className="text-subtle mt-1 text-xs">
              {formatNumber(s.orders)} order{s.orders === 1 ? "" : "s"}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
