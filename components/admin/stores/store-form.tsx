"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/admin/form-field";
import { ThemePicker } from "./theme-picker";
import { BackgroundPicker } from "./background-picker";
import { StorePreview } from "./store-preview";
import {
  createStoreAction,
  updateStoreAction,
  type StoreFormState,
} from "@/lib/actions/stores";
import type { ThemePreset, BackgroundStyle } from "@/lib/store-themes";

export interface StoreFormValues {
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  nit: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  themePreset: ThemePreset;
  backgroundStyle: BackgroundStyle;
  heroImageUrl: string | null;
  heroHeadline: string | null;
  heroSubtext: string | null;
  isActive: boolean;
}

interface StoreFormProps {
  storeId?: string;
  defaultValues?: StoreFormValues;
}

export function StoreForm({ storeId, defaultValues }: StoreFormProps) {
  const isEdit = Boolean(storeId);
  const action = isEdit ? updateStoreAction.bind(null, storeId!) : createStoreAction;
  const [state, formAction, pending] = useActionState<StoreFormState, FormData>(
    action,
    null
  );
  const fe = state?.fieldErrors ?? {};

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [theme, setTheme] = useState<ThemePreset>(
    defaultValues?.themePreset ?? "default"
  );
  const [bg, setBg] = useState<BackgroundStyle>(
    defaultValues?.backgroundStyle ?? "plain"
  );
  const [heroImage, setHeroImage] = useState(defaultValues?.heroImageUrl ?? "");
  const [heroHeadline, setHeroHeadline] = useState(defaultValues?.heroHeadline ?? "");
  const [heroSubtext, setHeroSubtext] = useState(defaultValues?.heroSubtext ?? "");

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_360px]" noValidate>
      <div className="space-y-6">
        {/* ---- Basic info ---- */}
        <section className="space-y-5 rounded-xl border border-line bg-raised p-5 shadow-sm">
          <header>
            <h2 className="font-display text-lg font-semibold text-content">Basic info</h2>
            <p className="mt-0.5 text-xs text-muted">
              Name and contact details customers will see.
            </p>
          </header>

          <FormField label="Store name" htmlFor="name" required error={fe.name}>
            <Input
              id="name"
              name="name"
              required
              autoFocus
              placeholder="La Esquina Bakery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              invalid={!!fe.name}
            />
          </FormField>

          <FormField
            label="URL slug"
            htmlFor="slug"
            hint="Leave blank to auto-generate"
            error={fe.slug}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-subtle">/market/</span>
              <Input
                id="slug"
                name="slug"
                placeholder="la-esquina"
                defaultValue={defaultValues?.slug ?? ""}
                invalid={!!fe.slug}
                className="flex-1"
              />
            </div>
          </FormField>

          <FormField label="Description" htmlFor="description" hint="Optional">
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Family bakery in downtown Bogotá since 1985."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Address" htmlFor="address" hint="Optional">
              <Input
                id="address"
                name="address"
                placeholder="Cra 45 #12-34, Bogotá"
                defaultValue={defaultValues?.address ?? ""}
              />
            </FormField>
            <FormField label="NIT" htmlFor="nit" hint="Optional">
              <Input
                id="nit"
                name="nit"
                placeholder="900.123.456-7"
                defaultValue={defaultValues?.nit ?? ""}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Contact email"
              htmlFor="contactEmail"
              hint="Optional"
              error={fe.contactEmail}
            >
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="hello@laesquina.com"
                defaultValue={defaultValues?.contactEmail ?? ""}
                invalid={!!fe.contactEmail}
              />
            </FormField>
            <FormField label="Contact phone" htmlFor="contactPhone" hint="Optional">
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="+57 300 123 4567"
                defaultValue={defaultValues?.contactPhone ?? ""}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={defaultValues?.isActive ?? true}
              className="h-4 w-4 rounded border-line text-brand focus:ring-2 focus:ring-ring"
            />
            <label htmlFor="isActive" className="text-sm text-content">
              Active — visible in the marketplace
            </label>
          </div>
        </section>

        {/* ---- Hero ---- */}
        <section className="space-y-5 rounded-xl border border-line bg-raised p-5 shadow-sm">
          <header>
            <h2 className="font-display text-lg font-semibold text-content">Hero</h2>
            <p className="mt-0.5 text-xs text-muted">
              The big banner at the top of your store page.
            </p>
          </header>

          <FormField
            label="Hero image URL"
            htmlFor="heroImageUrl"
            hint="Optional — file upload coming soon"
            error={fe.heroImageUrl}
          >
            <Input
              id="heroImageUrl"
              name="heroImageUrl"
              type="url"
              placeholder="https://…"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              invalid={!!fe.heroImageUrl}
            />
          </FormField>

          <FormField
            label="Headline"
            htmlFor="heroHeadline"
            hint="Overrides description in the hero"
          >
            <Input
              id="heroHeadline"
              name="heroHeadline"
              placeholder="Fresh bread, every morning"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
            />
          </FormField>

          <FormField label="Subtext" htmlFor="heroSubtext" hint="A short supporting line">
            <Input
              id="heroSubtext"
              name="heroSubtext"
              placeholder="Open Tue–Sun, 7am–7pm"
              value={heroSubtext}
              onChange={(e) => setHeroSubtext(e.target.value)}
            />
          </FormField>
        </section>

        {/* ---- Theme ---- */}
        <section className="space-y-5 rounded-xl border border-line bg-raised p-5 shadow-sm">
          <header>
            <h2 className="font-display text-lg font-semibold text-content">Theme</h2>
            <p className="mt-0.5 text-xs text-muted">
              The accent color of your storefront. Text and backgrounds stay consistent
              for readability.
            </p>
          </header>

          <FormField label="Color preset" htmlFor="themePreset">
            <ThemePicker value={theme} onChange={setTheme} />
          </FormField>

          <FormField label="Background style" htmlFor="backgroundStyle">
            <BackgroundPicker value={bg} onChange={setBg} />
          </FormField>
        </section>

        {state?.error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger"
          >
            {state.error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/stores">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={pending}
            className="w-full sm:w-auto"
          >
            {pending
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
                ? "Save changes"
                : "Create store"}
          </Button>
        </div>
      </div>

      {/* ---- Live preview ---- */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-subtle">
          Live preview
        </p>
        <StorePreview
          name={name}
          description={description || null}
          themePreset={theme}
          backgroundStyle={bg}
          heroImageUrl={heroImage || null}
          heroHeadline={heroHeadline || null}
          heroSubtext={heroSubtext || null}
        />
      </aside>
    </form>
  );
}