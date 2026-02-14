"use client";

// Detail page for Subscription Plan
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubscriptionPlan, useUpdateSubscriptionPlan } from "../hooks/subscription-plan.hooks.js";
import { SubscriptionPlanForm } from "../forms/subscription-plan-form.js";
import type { SubscriptionPlan } from "../types/subscription-plan.js";
import { Button } from "@/components/ui/button";

export function SubscriptionPlanDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubscriptionPlan(params.id);
  const updateMutation = useUpdateSubscriptionPlan();

  const handleSubmit = (formData: Partial<SubscriptionPlan>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subscription-plan") },
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
      <Button variant="ghost" onClick={() => router.push("/subscription-plan")}>← Back</Button>
      <SubscriptionPlanForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}