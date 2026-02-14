"use client";

// Detail page for Pricing Rule Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePricingRuleDetail, useUpdatePricingRuleDetail } from "../hooks/pricing-rule-detail.hooks.js";
import { PricingRuleDetailForm } from "../forms/pricing-rule-detail-form.js";
import type { PricingRuleDetail } from "../types/pricing-rule-detail.js";
import { Button } from "@/components/ui/button";

export function PricingRuleDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePricingRuleDetail(params.id);
  const updateMutation = useUpdatePricingRuleDetail();

  const handleSubmit = (formData: Partial<PricingRuleDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pricing-rule-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/pricing-rule-detail")}>← Back</Button>
      <PricingRuleDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}