import { formatCurrency } from "@/lib/utils";

interface CartTotalsProps {
  subtotal: string | number;
  taxRate?: number;
  taxLabel?: string;
}

export function CartTotals({
  subtotal,
  taxRate = 0.08,
  taxLabel = "Tax (8%)",
}: CartTotalsProps) {
  const sub = typeof subtotal === "string" ? Number(subtotal) : subtotal;
  const tax = sub * taxRate;
  const total = sub + tax;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between text-muted">
        <span>Subtotal</span>
        <span className="num">{formatCurrency(sub)}</span>
      </div>
      <div className="flex items-center justify-between text-muted">
        <span>{taxLabel}</span>
        <span className="num">{formatCurrency(tax)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-3 text-base font-semibold text-content">
        <span>Total</span>
        <span className="num">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}