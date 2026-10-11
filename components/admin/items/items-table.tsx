import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { DeleteItemButton } from "./delete-item-button";
import { formatCurrency } from "@/lib/utils";
import type { ItemRow } from "@/lib/queries";

const UNIT_LABEL: Record<ItemRow["unit"], string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "l",
  UNIT: "u",
};

function stockTone(stock: number) {
  if (stock <= 0) return { dot: "bg-danger", text: "text-danger" };
  if (stock < 10) return { dot: "bg-warning", text: "text-warning" };
  return { dot: "bg-success", text: "text-content" };
}

export function ItemsTable({ items }: { items: ItemRow[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No items yet"
        description="Add your first ingredient to start building products."
        action={
          <Link href="/admin/items/new">
            <Button variant="primary" size="md">
              Add item
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
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3 text-right">Unit cost</th>
              <th className="px-5 py-3 text-right">Stock value</th>
              <th className="px-5 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const stock = Number(item.current_stock);
              const cost = Number(item.unit_cost);
              const tone = stockTone(stock);
              return (
                <tr
                  key={item.id}
                  className="border-line hover:bg-hover border-b last:border-0"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/items/${item.id}/edit`}
                      className="text-content hover:text-brand font-medium"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden
                        className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`}
                      />
                      <span className={`num ${tone.text}`}>
                        {stock} {UNIT_LABEL[item.unit]}
                      </span>
                    </span>
                  </td>
                  <td className="num text-muted px-5 py-3 text-right">
                    {formatCurrency(cost)}
                  </td>
                  <td className="num text-content px-5 py-3 text-right font-medium">
                    {formatCurrency(stock * cost)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="text-muted hover:bg-hover hover:text-content rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                      >
                        Edit
                      </Link>
                      <DeleteItemButton itemId={item.id} itemName={item.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-line divide-y md:hidden">
        {items.map((item) => {
          const stock = Number(item.current_stock);
          const cost = Number(item.unit_cost);
          const tone = stockTone(stock);
          return (
            <li key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/items/${item.id}/edit`}
                    className="text-content truncate font-medium"
                  >
                    {item.name}
                  </Link>
                  <div className="text-muted mt-1 flex items-center gap-2 text-xs">
                    <span
                      aria-hidden
                      className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`}
                    />
                    <span className={`num ${tone.text}`}>
                      {stock} {UNIT_LABEL[item.unit]}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="num">{formatCurrency(cost)}</span>
                  </div>
                </div>
                <DeleteItemButton itemId={item.id} itemName={item.name} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
