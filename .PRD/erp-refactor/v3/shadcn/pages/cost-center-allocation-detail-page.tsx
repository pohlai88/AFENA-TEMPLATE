"use client";

// Detail page for Cost Center Allocation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCostCenterAllocation, useUpdateCostCenterAllocation } from "../hooks/cost-center-allocation.hooks.js";
import { CostCenterAllocationForm } from "../forms/cost-center-allocation-form.js";
import type { CostCenterAllocation } from "../types/cost-center-allocation.js";
import { Button } from "@/components/ui/button";

export function CostCenterAllocationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCostCenterAllocation(params.id);
  const updateMutation = useUpdateCostCenterAllocation();

  const handleSubmit = (formData: Partial<CostCenterAllocation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/cost-center-allocation") },
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
      <Button variant="ghost" onClick={() => router.push("/cost-center-allocation")}>← Back</Button>
      <CostCenterAllocationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}