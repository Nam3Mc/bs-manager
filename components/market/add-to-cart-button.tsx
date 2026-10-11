"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/lib/actions/cart";
import { PlusIcon, CheckIcon } from "./icons";

export function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await addToCartAction(productId, 1);
      if (res.error) {
        setError(res.error);
        return;
      }
      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 1500);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="accent"
        size="sm"
        onClick={handleClick}
        disabled={pending}
        aria-label={added ? "Added to cart" : "Add to cart"}
        className="shrink-0"
      >
        {added ? (
          <>
            <CheckIcon />
            Added
          </>
        ) : (
          <>
            <PlusIcon />
            Add
          </>
        )}
      </Button>
      {error && (
        <p role="alert" className="text-[10px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}