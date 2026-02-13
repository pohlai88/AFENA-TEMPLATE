"use client";

// Detail page for Shipping Rule Condition
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShippingRuleCondition, useUpdateShippingRuleCondition } from "../hooks/shipping-rule-condition.hooks.js";
import { ShippingRuleConditionForm } from "../forms/shipping-rule-condition-form.js";
import type { ShippingRuleCondition } from "../types/shipping-rule-condition.js";
import { Button } from "@/components/ui/button";

export function ShippingRuleConditionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShippingRuleCondition(params.id);
  const updateMutation = useUpdateShippingRuleCondition();

  const handleSubmit = (formData: Partial<ShippingRuleCondition>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shipping-rule-condition") },
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
      <Button variant="ghost" onClick={() => router.push("/shipping-rule-condition")}>← Back</Button>
      <ShippingRuleConditionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}