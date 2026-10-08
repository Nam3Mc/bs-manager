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
            <tr className="border-b border-line bg-sunken text-left text-xs font-medium uppercase tracking-wider text-subtle">
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
                <tr key={item.id} className="border-b border-line last:border-0 hover:bg-hover">
                  <td className="px-5 py-3">
                    <Link href={`/admin/items/${item.id}/edit`} className="font-medium text-content hover:text-brand">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
                      <span className={`num ${tone.text}`}>
                        {stock} {UNIT_LABEL[item.unit]}
                      </span>
                    </span>
                  </td>
                  <td className="num px-5 py-3 text-right text-muted">{formatCurrency(cost)}</td>
                  <td className="num px-5 py-3 text-right font-medium text-content">{formatCurrency(stock * cost)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:bg-hover hover:text-content"
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

      <ul className="divide-y divide-line md:hidden">
        {items.map((item) => {
          const stock = Number(item.current_stock);
          const cost = Number(item.unit_cost);
          const tone = stockTone(stock);
          return (
            <li key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/items/${item.id}/edit`} className="truncate font-medium text-content">
                    {item.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
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