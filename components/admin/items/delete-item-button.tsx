"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteItemAction } from "@/lib/actions/items";

export function DeleteItemButton({
  itemId,
  itemName,
}: {
  itemId: string;
  itemName: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteItemAction(itemId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-muted hover:bg-danger/10 hover:text-danger rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !pending && setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`del-${itemId}`}
            className="border-line bg-raised relative w-full max-w-md rounded-xl border p-6 shadow-lg"
          >
            <h2
              id={`del-${itemId}`}
              className="font-display text-content text-lg font-semibold"
            >
              Delete item
            </h2>
            <p className="text-muted mt-2 text-sm">
              Are you sure you want to delete{" "}
              <span className="text-content font-medium">{itemName}</span>? This cannot be
              undone.
            </p>

            {error && (
              <p
                role="alert"
                className="border-danger/40 bg-danger/5 text-danger mt-4 rounded-lg border px-3 py-2 text-sm"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="md"
                onClick={handleConfirm}
                disabled={pending}
                className="w-full sm:w-auto"
              >
                {pending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
