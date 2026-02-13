"use client";

// Detail page for Cost Center
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCostCenter, useUpdateCostCenter } from "../hooks/cost-center.hooks.js";
import { CostCenterForm } from "../forms/cost-center-form.js";
import type { CostCenter } from "../types/cost-center.js";
import { Button } from "@/components/ui/button";

export function CostCenterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCostCenter(params.id);
  const updateMutation = useUpdateCostCenter();

  const handleSubmit = (formData: Partial<CostCenter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/cost-center") },
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
      <Button variant="ghost" onClick={() => router.push("/cost-center")}>← Back</Button>
      <CostCenterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}