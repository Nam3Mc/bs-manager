"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";
import { createBusinessAction, type BusinessFormState } from "@/lib/actions/business";

export function BusinessSetupForm() {
  const [state, formAction, pending] = useActionState<BusinessFormState, FormData>(
    createBusinessAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormField label="Business name" htmlFor="name" required>
        <Input
          id="name"
          name="name"
          required
          placeholder="La Esquina Bakery"
          invalid={!!state?.error}
        />
      </FormField>
      <FormField label="NIT / Tax ID" htmlFor="nit" hint="Optional">
        <Input id="nit" name="nit" placeholder="900.123.456-7" invalid={!!state?.error} />
      </FormField>
      <FormField label="Address" htmlFor="address" hint="Optional">
        <Input
          id="address"
          name="address"
          placeholder="Cra 45 #12-34, Bogotá"
          invalid={!!state?.error}
        />
      </FormField>

      {state?.error && (
        <p
          role="alert"
          className="border-danger/40 bg-danger/5 text-danger rounded-lg border px-3 py-2 text-sm"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Creating…" : "Create business"}
      </Button>
    </form>
  );
}
