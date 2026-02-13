"use client";

// Detail page for Landed Cost Taxes and Charges
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLandedCostTaxesAndCharges, useUpdateLandedCostTaxesAndCharges } from "../hooks/landed-cost-taxes-and-charges.hooks.js";
import { LandedCostTaxesAndChargesForm } from "../forms/landed-cost-taxes-and-charges-form.js";
import type { LandedCostTaxesAndCharges } from "../types/landed-cost-taxes-and-charges.js";
import { Button } from "@/components/ui/button";

export function LandedCostTaxesAndChargesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLandedCostTaxesAndCharges(params.id);
  const updateMutation = useUpdateLandedCostTaxesAndCharges();

  const handleSubmit = (formData: Partial<LandedCostTaxesAndCharges>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/landed-cost-taxes-and-charges") },
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
      <Button variant="ghost" onClick={() => router.push("/landed-cost-taxes-and-charges")}>← Back</Button>
      <LandedCostTaxesAndChargesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}