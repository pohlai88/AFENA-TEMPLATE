"use client";

// Detail page for Pricing Rule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePricingRule, useUpdatePricingRule } from "../hooks/pricing-rule.hooks.js";
import { PricingRuleForm } from "../forms/pricing-rule-form.js";
import type { PricingRule } from "../types/pricing-rule.js";
import { Button } from "@/components/ui/button";

export function PricingRuleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePricingRule(params.id);
  const updateMutation = useUpdatePricingRule();

  const handleSubmit = (formData: Partial<PricingRule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pricing-rule") },
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
      <Button variant="ghost" onClick={() => router.push("/pricing-rule")}>← Back</Button>
      <PricingRuleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}