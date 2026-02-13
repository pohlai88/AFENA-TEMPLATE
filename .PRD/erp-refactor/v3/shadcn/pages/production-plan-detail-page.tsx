"use client";

// Detail page for Production Plan
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlan, useUpdateProductionPlan } from "../hooks/production-plan.hooks.js";
import { ProductionPlanForm } from "../forms/production-plan-form.js";
import type { ProductionPlan } from "../types/production-plan.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlan(params.id);
  const updateMutation = useUpdateProductionPlan();

  const handleSubmit = (formData: Partial<ProductionPlan>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan")}>← Back</Button>
      <ProductionPlanForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}