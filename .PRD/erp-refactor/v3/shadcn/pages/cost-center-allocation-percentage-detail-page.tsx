"use client";

// Detail page for Cost Center Allocation Percentage
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCostCenterAllocationPercentage, useUpdateCostCenterAllocationPercentage } from "../hooks/cost-center-allocation-percentage.hooks.js";
import { CostCenterAllocationPercentageForm } from "../forms/cost-center-allocation-percentage-form.js";
import type { CostCenterAllocationPercentage } from "../types/cost-center-allocation-percentage.js";
import { Button } from "@/components/ui/button";

export function CostCenterAllocationPercentageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCostCenterAllocationPercentage(params.id);
  const updateMutation = useUpdateCostCenterAllocationPercentage();

  const handleSubmit = (formData: Partial<CostCenterAllocationPercentage>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/cost-center-allocation-percentage") },
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
      <Button variant="ghost" onClick={() => router.push("/cost-center-allocation-percentage")}>← Back</Button>
      <CostCenterAllocationPercentageForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}