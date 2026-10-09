"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/admin/form-field";
import { Card, CardBody } from "@/components/ui/card";
import { createStoreAction, StoreFormState } from "@/lib/actions/stores";

export default function NewStorePage() {
  const [state, formAction, pending] = useActionState<StoreFormState, FormData>(
    createStoreAction,
    null
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-content sm:text-3xl">
          New store
        </h1>
        <p className="mt-1 text-sm text-muted">
          Basic info now. Theming, hero image, and description come next.
        </p>
      </div>

      <Card>
        <CardBody>
          <form action={formAction} className="space-y-5" noValidate>
            <FormField label="Store name" htmlFor="name" required error={fe.name}>
              <Input id="name" name="name" required autoFocus placeholder="La Esquina Bakery" invalid={!!fe.name} />
            </FormField>

            <FormField label="Description" htmlFor="description" hint="Optional">
              <Textarea
                id="description"
                name="description"
                placeholder="Family bakery in downtown Bogotá since 1985."
              />
            </FormField>

            <FormField label="Address" htmlFor="address" hint="Optional">
              <Input id="address" name="address" placeholder="Cra 45 #12-34, Bogotá" />
            </FormField>

            <FormField label="NIT" htmlFor="nit" hint="Optional">
              <Input id="nit" name="nit" placeholder="900.123.456-7" />
            </FormField>

            {state?.error && (
              <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger">
                {state.error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Link href="/admin/stores">
                <Button type="button" variant="secondary" size="md" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md" disabled={pending} className="w-full sm:w-auto">
                {pending ? "Creating…" : "Create store"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}