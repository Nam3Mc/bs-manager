"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/admin/form-field";
import {
  RecipeBuilder,
  makeLine,
  type AvailableItem,
  type RecipeLineState,
} from "./recipe-builder";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/lib/actions/products";
import { formatCurrency } from "@/lib/utils";

export interface ProductFormValues {
  storeId: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isActive: boolean;
  recipe: { itemId: string; quantity: string }[];
}

interface ProductFormProps {
  productId?: string;
  stores: { id: string; name: string }[];
  availableItems: AvailableItem[];
  defaultValues?: ProductFormValues;
}

export function ProductForm({
  productId,
  stores,
  availableItems,
  defaultValues,
}: ProductFormProps) {
  const isEdit = Boolean(productId);
  const action = isEdit
    ? updateProductAction.bind(null, productId!)
    : createProductAction;
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    null
  );
  const fe = state?.fieldErrors ?? {};

  const [recipe, setRecipe] = useState<RecipeLineState[]>(() =>
    defaultValues?.recipe?.length
      ? defaultValues.recipe.map((r) => makeLine(r.itemId, r.quantity))
      : []
  );

  const [price, setPrice] = useState(defaultValues?.price ?? "0");

  const recipeJson = useMemo(
    () =>
      JSON.stringify(
        recipe
          .filter((r) => r.itemId && Number(r.quantity) > 0)
          .map((r) => ({ itemId: r.itemId, quantity: Number(r.quantity) }))
      ),
    [recipe]
  );

  const itemMap = new Map(availableItems.map((i) => [i.id, i]));
  const derivedCost = recipe.reduce((sum, line) => {
    const item = itemMap.get(line.itemId);
    const qty = Number(line.quantity);
    if (!item || !Number.isFinite(qty) || qty <= 0) return sum;
    return sum + qty * Number(item.unit_cost);
  }, 0);

  const priceNum = Number(price);
  const margin =
    Number.isFinite(priceNum) && priceNum > 0
      ? ((priceNum - derivedCost) / priceNum) * 100
      : 0;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="recipe" value={recipeJson} />

      {stores.length === 0 ? (
        <div className="rounded-lg border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          You need a store before creating products.{" "}
          <Link href="/admin/stores/new" className="underline">
            Create a store
          </Link>
          .
        </div>
      ) : (
        <FormField label="Store" htmlFor="storeId" required error={fe.storeId}>
          <Select
            id="storeId"
            name="storeId"
            defaultValue={defaultValues?.storeId ?? stores[0]?.id ?? ""}
            invalid={!!fe.storeId}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <FormField label="Name" htmlFor="name" required error={fe.name}>
          <Input
            id="name"
            name="name"
            required
            autoFocus
            placeholder="500 g Corn Flour"
            defaultValue={defaultValues?.name ?? ""}
            invalid={!!fe.name}
          />
        </FormField>

        <FormField label="Price" htmlFor="price" required error={fe.price} hint="What the customer pays">
          <div className="relative">
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              invalid={!!fe.price}
              className="num pl-7"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-subtle"
            >
              $
            </span>
          </div>
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description" hint="Optional">
        <Textarea
          id="description"
          name="description"
          placeholder="Stone-ground corn flour, 500 g package."
          defaultValue={defaultValues?.description ?? ""}
        />
      </FormField>

      <FormField label="Image URL" htmlFor="imageUrl" hint="Optional — file upload coming soon">
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
          defaultValue={defaultValues?.imageUrl ?? ""}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={defaultValues?.isActive ?? true}
          className="h-4 w-4 rounded border-line text-brand focus:ring-2 focus:ring-ring"
        />
        <label htmlFor="isActive" className="text-sm text-content">
          Active — visible to customers
        </label>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <RecipeBuilder
          availableItems={availableItems}
          lines={recipe}
          onChange={setRecipe}
        />
        {fe.recipe && (
          <p className="mt-2 text-xs text-danger" role="alert">
            {fe.recipe}
          </p>
        )}

        {derivedCost > 0 && priceNum > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3 text-sm">
            <Stat label="Cost" value={formatCurrency(derivedCost)} />
            <Stat label="Price" value={formatCurrency(priceNum)} />
            <Stat
              label="Margin"
              value={`${margin.toFixed(1)}%`}
              tone={margin < 0 ? "danger" : margin < 20 ? "warning" : "success"}
            />
          </div>
        )}
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href="/admin/products">
          <Button type="button" variant="secondary" size="md" className="w-full sm:w-auto">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={pending || stores.length === 0}
          className="w-full sm:w-auto"
        >
          {pending ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const colors = {
    default: "text-content",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-subtle">{label}</p>
      <p className={`num mt-0.5 font-semibold ${colors[tone]}`}>{value}</p>
    </div>
  );
}