"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/admin/form-field";
import { createItemAction, updateItemAction, type ItemFormState } from "@/lib/actions/items";

const UNITS = [
  { value: "G", label: "Grams (g)" },
  { value: "KG", label: "Kilograms (kg)" },
  { value: "ML", label: "Milliliters (ml)" },
  { value: "L", label: "Liters (l)" },
  { value: "UNIT", label: "Units (u)" },
];

export interface ItemFormValues {
  name: string;
  unit: string;
  currentStock: string;
  unitCost: string;
  imageUrl: string | null;
}

export function ItemForm({
  itemId,
  defaultValues,
}: {
  itemId?: string;
  defaultValues?: ItemFormValues;
}) {
  const isEdit = Boolean(itemId);
  const action = isEdit ? updateItemAction.bind(null, itemId!) : createItemAction;
  const [state, formAction, pending] = useActionState<ItemFormState, FormData>(action, null);
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <FormField label="Name" htmlFor="name" required error={fe.name}>
        <Input
          id="name"
          name="name"
          required
          autoFocus
          placeholder="Yellow corn"
          defaultValue={defaultValues?.name ?? ""}
          invalid={!!fe.name}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Unit" htmlFor="unit" required error={fe.unit}>
          <Select id="unit" name="unit" defaultValue={defaultValues?.unit ?? "G"} invalid={!!fe.unit}>
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Unit cost" htmlFor="unitCost" hint="Cost per unit" required error={fe.unitCost}>
          <Input
            id="unitCost"
            name="unitCost"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            defaultValue={defaultValues?.unitCost ?? "0"}
            invalid={!!fe.unitCost}
            className="num"
          />
        </FormField>
      </div>

      <FormField label="Current stock" htmlFor="currentStock" hint="How much you have on hand" required error={fe.currentStock}>
        <Input
          id="currentStock"
          name="currentStock"
          type="number"
          min="0"
          step="0.001"
          required
          placeholder="0"
          defaultValue={defaultValues?.currentStock ?? "0"}
          invalid={!!fe.currentStock}
          className="num"
        />
      </FormField>

      <FormField label="Image URL" htmlFor="imageUrl" hint="Optional — file upload coming soon" error={fe.imageUrl}>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
          defaultValue={defaultValues?.imageUrl ?? ""}
          invalid={!!fe.imageUrl}
        />
      </FormField>

      {state?.error && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Link href="/admin/items">
          <Button type="button" variant="secondary" size="md" className="w-full sm:w-auto">
            Cancel
          </Button>
        </Link>
        <Button type="submit" variant="primary" size="md" disabled={pending} className="w-full sm:w-auto">
          {pending ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save changes" : "Create item"}
        </Button>
      </div>
    </form>
  );
}