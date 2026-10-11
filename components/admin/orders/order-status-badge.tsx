import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/queries";

const STYLES: Record<
  OrderStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  PENDING: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    label: "Pending",
  },
  PAID: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
    label: "Paid",
  },
  SHIPPED: {
    bg: "bg-brand-soft",
    text: "text-brand",
    dot: "bg-brand",
    label: "Shipped",
  },
  DELIVERED: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    label: "Delivered",
  },
  CANCELLED: {
    bg: "bg-danger/10",
    text: "text-danger",
    dot: "bg-danger",
    label: "Cancelled",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.bg,
        s.text
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
