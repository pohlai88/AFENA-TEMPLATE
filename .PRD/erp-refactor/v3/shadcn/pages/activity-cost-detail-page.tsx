"use client";

// Detail page for Activity Cost
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useActivityCost, useUpdateActivityCost } from "../hooks/activity-cost.hooks.js";
import { ActivityCostForm } from "../forms/activity-cost-form.js";
import type { ActivityCost } from "../types/activity-cost.js";
import { Button } from "@/components/ui/button";

export function ActivityCostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useActivityCost(params.id);
  const updateMutation = useUpdateActivityCost();

  const handleSubmit = (formData: Partial<ActivityCost>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/activity-cost") },
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
      <Button variant="ghost" onClick={() => router.push("/activity-cost")}>← Back</Button>
      <ActivityCostForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}