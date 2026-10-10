"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import {
  updateCartQuantityAction,
  removeFromCartAction,
} from "@/lib/actions/cart";
import { cn } from "@/lib/utils";
import type { CartLine as CartLineType } from "@/lib/queries";

export function CartLine({ line }: { line: CartLineType }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(line.quantity);

  const price = Number(line.price);
  const lineTotal = price * quantity;

  function updateQty(next: number) {
    if (next < 1 || next > 999) return;
    setQuantity(next);
    setError(null);
    startTransition(async () => {
      const res = await updateCartQuantityAction(line.id, next);
      if (res.error) {
        setError(res.error);
        setQuantity(line.quantity);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      const res = await removeFromCartAction(line.id);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <li className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
      {/* Thumb */}
      <Link
        href={`/market/${line.store_slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sunken"
      >
        {line.product_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={line.product_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-soft">
            <span className="text-lg font-display font-bold text-brand/40">
              {line.product_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/market/${line.store_slug}`}
          className="text-[11px] font-medium uppercase tracking-wider text-brand hover:text-brand-hover"
        >
          {line.store_name}
        </Link>
        <h3 className="mt-0.5 truncate text-sm font-semibold text-content">
          {line.product_name}
        </h3>
        <p className="num mt-0.5 text-xs text-muted">
          {formatCurrency(price)} each
        </p>

        {error && (
          <p role="alert" className="mt-1 text-xs text-danger">
            {error}
          </p>
        )}

        {/* Quantity + remove */}
        <div className="mt-3 flex items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-line bg-raised">
            <button
              type="button"
              onClick={() => updateQty(quantity - 1)}
              disabled={pending || quantity <= 1}
              aria-label="Decrease quantity"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-l-lg text-muted",
                "transition-colors duration-150",
                "hover:bg-hover hover:text-content",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-40 disabled:hover:bg-transparent"
              )}
            >
              −
            </button>
            <span className="num w-8 text-center text-sm font-medium text-content">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQty(quantity + 1)}
              disabled={pending || quantity >= 999}
              aria-label="Increase quantity"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-r-lg text-muted",
                "transition-colors duration-150",
                "hover:bg-hover hover:text-content",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-40 disabled:hover:bg-transparent"
              )}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="text-xs font-medium text-muted transition-colors duration-150 hover:text-danger disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="num shrink-0 text-right text-sm font-semibold text-content">
        {formatCurrency(lineTotal)}
      </div>
    </li>
  );
}