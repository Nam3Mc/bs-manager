"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/queries";

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const [value, setValue] = useState<OrderStatus>(current);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onChange(next: OrderStatus) {
    setError(null);
    setValue(next);
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, next);
      if (res.error) {
        setError(res.error);
        setValue(current);
      }
    });
  }

  return (
    <div className="space-y-1.5">
      <Select
        value={value}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        aria-label="Order status"
        invalid={!!error}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}