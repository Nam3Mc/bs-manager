"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createOrdersFromCartAction } from "@/lib/actions/orders";

export function PlaceOrderButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await createOrdersFromCartAction();
      if (res?.error) {
        setError(res.error);
        router.refresh();
      }
      // Success path redirects from the action — no code runs after.
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="accent"
        size="lg"
        onClick={handleClick}
        disabled={pending || disabled}
        className="w-full"
      >
        {pending ? "Placing order…" : "Place order"}
      </Button>
      {error && (
        <p
          role="alert"
          className="border-danger/40 bg-danger/5 text-danger rounded-lg border px-3 py-2 text-sm"
        >
          {error}
        </p>
      )}
    </div>
  );
}
