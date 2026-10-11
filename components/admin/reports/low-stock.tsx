import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import type { LowStockItem } from "@/lib/queries";

const UNIT_LABEL: Record<string, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "l",
  UNIT: "u",
};

export function LowStock({ items }: { items: LowStockItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-success flex items-center gap-2 py-6 text-sm">
        <span aria-hidden className="bg-success h-2 w-2 rounded-full" />
        All items are well stocked.
      </div>
    );
  }

  return (
    <ul className="divide-line divide-y">
      {items.map((item) => {
        const stock = Number(item.current_stock);
        const critical = stock <= 0;
        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 shrink-0 rounded-full ${critical ? "bg-danger" : "bg-warning"}`}
              />
              <Link
                href={`/admin/items/${item.id}/edit`}
                className="text-content hover:text-brand truncate text-sm font-medium"
              >
                {item.name}
              </Link>
            </div>
            <p
              className={`num shrink-0 text-sm font-medium ${critical ? "text-danger" : "text-warning"}`}
            >
              {formatNumber(stock)} {UNIT_LABEL[item.unit] ?? item.unit}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
