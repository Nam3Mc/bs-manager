"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { updateCartQuantityAction, removeFromCartAction } from "@/lib/actions/cart";
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
        className="bg-sunken relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
      >
        {line.product_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={line.product_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="bg-brand-soft flex h-full w-full items-center justify-center">
            <span className="font-display text-brand/40 text-lg font-bold">
              {line.product_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/market/${line.store_slug}`}
          className="text-brand hover:text-brand-hover text-[11px] font-medium tracking-wider uppercase"
        >
          {line.store_name}
        </Link>
        <h3 className="text-content mt-0.5 truncate text-sm font-semibold">
          {line.product_name}
        </h3>
        <p className="num text-muted mt-0.5 text-xs">{formatCurrency(price)} each</p>

        {error && (
          <p role="alert" className="text-danger mt-1 text-xs">
            {error}
          </p>
        )}

        {/* Quantity + remove */}
        <div className="mt-3 flex items-center gap-3">
          <div className="border-line bg-raised inline-flex items-center rounded-lg border">
            <button
              type="button"
              onClick={() => updateQty(quantity - 1)}
              disabled={pending || quantity <= 1}
              aria-label="Decrease quantity"
              className={cn(
                "text-muted flex h-8 w-8 items-center justify-center rounded-l-lg",
                "transition-colors duration-150",
                "hover:bg-hover hover:text-content",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                "disabled:opacity-40 disabled:hover:bg-transparent"
              )}
            >
              −
            </button>
            <span className="num text-content w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQty(quantity + 1)}
              disabled={pending || quantity >= 999}
              aria-label="Increase quantity"
              className={cn(
                "text-muted flex h-8 w-8 items-center justify-center rounded-r-lg",
                "transition-colors duration-150",
                "hover:bg-hover hover:text-content",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
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
            className="text-muted hover:text-danger text-xs font-medium transition-colors duration-150 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="num text-content shrink-0 text-right text-sm font-semibold">
        {formatCurrency(lineTotal)}
      </div>
    </li>
  );
}
