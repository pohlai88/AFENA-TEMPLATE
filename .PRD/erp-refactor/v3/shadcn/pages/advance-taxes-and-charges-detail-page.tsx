"use client";

// Detail page for Advance Taxes and Charges
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAdvanceTaxesAndCharges, useUpdateAdvanceTaxesAndCharges } from "../hooks/advance-taxes-and-charges.hooks.js";
import { AdvanceTaxesAndChargesForm } from "../forms/advance-taxes-and-charges-form.js";
import type { AdvanceTaxesAndCharges } from "../types/advance-taxes-and-charges.js";
import { Button } from "@/components/ui/button";

export function AdvanceTaxesAndChargesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAdvanceTaxesAndCharges(params.id);
  const updateMutation = useUpdateAdvanceTaxesAndCharges();

  const handleSubmit = (formData: Partial<AdvanceTaxesAndCharges>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/advance-taxes-and-charges") },
    );
  };

  if (isFetching) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!data) {
    return <p className="text-destructive">Not found</p>;
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push("/advance-taxes-and-charges")}>← Back</Button>
      <AdvanceTaxesAndChargesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}