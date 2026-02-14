"use client";

// Detail page for Production Plan Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlanItem, useUpdateProductionPlanItem } from "../hooks/production-plan-item.hooks.js";
import { ProductionPlanItemForm } from "../forms/production-plan-item-form.js";
import type { ProductionPlanItem } from "../types/production-plan-item.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlanItem(params.id);
  const updateMutation = useUpdateProductionPlanItem();

  const handleSubmit = (formData: Partial<ProductionPlanItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan-item") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan-item")}>← Back</Button>
      <ProductionPlanItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}