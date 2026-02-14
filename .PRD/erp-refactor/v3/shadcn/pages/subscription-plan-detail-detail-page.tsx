"use client";

// Detail page for Subscription Plan Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubscriptionPlanDetail, useUpdateSubscriptionPlanDetail } from "../hooks/subscription-plan-detail.hooks.js";
import { SubscriptionPlanDetailForm } from "../forms/subscription-plan-detail-form.js";
import type { SubscriptionPlanDetail } from "../types/subscription-plan-detail.js";
import { Button } from "@/components/ui/button";

export function SubscriptionPlanDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubscriptionPlanDetail(params.id);
  const updateMutation = useUpdateSubscriptionPlanDetail();

  const handleSubmit = (formData: Partial<SubscriptionPlanDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subscription-plan-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/subscription-plan-detail")}>← Back</Button>
      <SubscriptionPlanDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}