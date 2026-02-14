"use client";

// Detail page for Pricing Rule Item Code
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePricingRuleItemCode, useUpdatePricingRuleItemCode } from "../hooks/pricing-rule-item-code.hooks.js";
import { PricingRuleItemCodeForm } from "../forms/pricing-rule-item-code-form.js";
import type { PricingRuleItemCode } from "../types/pricing-rule-item-code.js";
import { Button } from "@/components/ui/button";

export function PricingRuleItemCodeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePricingRuleItemCode(params.id);
  const updateMutation = useUpdatePricingRuleItemCode();

  const handleSubmit = (formData: Partial<PricingRuleItemCode>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pricing-rule-item-code") },
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
      <Button variant="ghost" onClick={() => router.push("/pricing-rule-item-code")}>← Back</Button>
      <PricingRuleItemCodeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}