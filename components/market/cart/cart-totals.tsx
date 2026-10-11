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
      <div className="text-muted flex items-center justify-between">
        <span>Subtotal</span>
        <span className="num">{formatCurrency(sub)}</span>
      </div>
      <div className="text-muted flex items-center justify-between">
        <span>{taxLabel}</span>
        <span className="num">{formatCurrency(tax)}</span>
      </div>
      <div className="border-line text-content flex items-center justify-between border-t pt-3 text-base font-semibold">
        <span>Total</span>
        <span className="num">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
