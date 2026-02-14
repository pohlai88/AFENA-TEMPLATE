"use client";

// Detail page for Pricing Rule Brand
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePricingRuleBrand, useUpdatePricingRuleBrand } from "../hooks/pricing-rule-brand.hooks.js";
import { PricingRuleBrandForm } from "../forms/pricing-rule-brand-form.js";
import type { PricingRuleBrand } from "../types/pricing-rule-brand.js";
import { Button } from "@/components/ui/button";

export function PricingRuleBrandDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePricingRuleBrand(params.id);
  const updateMutation = useUpdatePricingRuleBrand();

  const handleSubmit = (formData: Partial<PricingRuleBrand>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pricing-rule-brand") },
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
      <Button variant="ghost" onClick={() => router.push("/pricing-rule-brand")}>← Back</Button>
      <PricingRuleBrandForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}