"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { PlusIcon, CloseIcon } from "@/components/admin/icons";

export interface AvailableItem {
  id: string;
  name: string;
  unit: string;
  unit_cost: string;
}

export interface RecipeLineState {
  /** local-only key — not persisted */
  key: string;
  itemId: string;
  quantity: string;
}

const UNIT_LABEL: Record<string, string> = {
  G: "g",
  KG: "kg",
  ML: "ml",
  L: "l",
  UNIT: "u",
};

export function makeLine(itemId = "", quantity = ""): RecipeLineState {
  return {
    key: Math.random().toString(36).slice(2),
    itemId,
    quantity,
  };
}

interface RecipeBuilderProps {
  availableItems: AvailableItem[];
  lines: RecipeLineState[];
  onChange: (next: RecipeLineState[]) => void;
}

export function RecipeBuilder({ availableItems, lines, onChange }: RecipeBuilderProps) {
  const itemMap = new Map(availableItems.map((i) => [i.id, i]));

  function update(index: number, patch: Partial<RecipeLineState>) {
    const next = lines.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(lines.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...lines, makeLine()]);
  }

  const derivedCost = lines.reduce((sum, line) => {
    const item = itemMap.get(line.itemId);
    const qty = Number(line.quantity);
    if (!item || !Number.isFinite(qty) || qty <= 0) return sum;
    return sum + qty * Number(item.unit_cost);
  }, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-content">Recipe</p>
          <p className="text-xs text-subtle">
            Which items and how much of each go into one unit of this product.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={add}
          disabled={availableItems.length === 0}
        >
          <PlusIcon />
          Add item
        </Button>
      </div>

      {availableItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-4 text-center text-sm text-muted">
          You haven&apos;t added any items yet.
        </div>
      ) : lines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-muted">
          No items in the recipe. This product is a passthrough SKU (no manufacturing cost).
        </div>
      ) : (
        <ul className="space-y-2">
          {lines.map((line, index) => {
            const item = itemMap.get(line.itemId);
            const qty = Number(line.quantity);
            const subtotal =
              item && Number.isFinite(qty) && qty > 0
                ? qty * Number(item.unit_cost)
                : 0;

            return (
              <li
                key={line.key}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded-lg border border-line bg-surface p-2"
              >
                <Select
                  value={line.itemId}
                  onChange={(e) => update(index, { itemId: e.target.value })}
                  aria-label="Item"
                >
                  <option value="">Select an item…</option>
                  {availableItems.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({formatCurrency(i.unit_cost)}/{UNIT_LABEL[i.unit] ?? i.unit})
                    </option>
                  ))}
                </Select>

                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    step="0.001"
                    value={line.quantity}
                    onChange={(e) => update(index, { quantity: e.target.value })}
                    placeholder="0"
                    aria-label="Quantity"
                    className="num w-24"
                  />
                  {item && (
                    <span className="text-xs text-subtle">
                      {UNIT_LABEL[item.unit] ?? item.unit}
                    </span>
                  )}
                </div>

                <div className="num w-20 text-right text-sm text-muted">
                  {subtotal > 0 ? formatCurrency(subtotal) : "—"}
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove row"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-line pt-3 text-sm">
        <span className="text-muted">Derived cost:</span>
        <span className="num font-semibold text-content">{formatCurrency(derivedCost)}</span>
      </div>
    </div>
  );
}