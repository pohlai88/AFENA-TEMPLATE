"use client";

// Detail page for Tax Withholding Rate
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxWithholdingRate, useUpdateTaxWithholdingRate } from "../hooks/tax-withholding-rate.hooks.js";
import { TaxWithholdingRateForm } from "../forms/tax-withholding-rate-form.js";
import type { TaxWithholdingRate } from "../types/tax-withholding-rate.js";
import { Button } from "@/components/ui/button";

export function TaxWithholdingRateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxWithholdingRate(params.id);
  const updateMutation = useUpdateTaxWithholdingRate();

  const handleSubmit = (formData: Partial<TaxWithholdingRate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-withholding-rate") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-withholding-rate")}>← Back</Button>
      <TaxWithholdingRateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}