"use client";

// Detail page for Pricing Rule Item Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePricingRuleItemGroup, useUpdatePricingRuleItemGroup } from "../hooks/pricing-rule-item-group.hooks.js";
import { PricingRuleItemGroupForm } from "../forms/pricing-rule-item-group-form.js";
import type { PricingRuleItemGroup } from "../types/pricing-rule-item-group.js";
import { Button } from "@/components/ui/button";

export function PricingRuleItemGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePricingRuleItemGroup(params.id);
  const updateMutation = useUpdatePricingRuleItemGroup();

  const handleSubmit = (formData: Partial<PricingRuleItemGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pricing-rule-item-group") },
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
      <Button variant="ghost" onClick={() => router.push("/pricing-rule-item-group")}>← Back</Button>
      <PricingRuleItemGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}