"use client";

// Detail page for Production Plan Sub Assembly Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlanSubAssemblyItem, useUpdateProductionPlanSubAssemblyItem } from "../hooks/production-plan-sub-assembly-item.hooks.js";
import { ProductionPlanSubAssemblyItemForm } from "../forms/production-plan-sub-assembly-item-form.js";
import type { ProductionPlanSubAssemblyItem } from "../types/production-plan-sub-assembly-item.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanSubAssemblyItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlanSubAssemblyItem(params.id);
  const updateMutation = useUpdateProductionPlanSubAssemblyItem();

  const handleSubmit = (formData: Partial<ProductionPlanSubAssemblyItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan-sub-assembly-item") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan-sub-assembly-item")}>← Back</Button>
      <ProductionPlanSubAssemblyItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}