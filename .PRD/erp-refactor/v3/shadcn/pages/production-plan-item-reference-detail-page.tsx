"use client";

// Detail page for Production Plan Item Reference
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlanItemReference, useUpdateProductionPlanItemReference } from "../hooks/production-plan-item-reference.hooks.js";
import { ProductionPlanItemReferenceForm } from "../forms/production-plan-item-reference-form.js";
import type { ProductionPlanItemReference } from "../types/production-plan-item-reference.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanItemReferenceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlanItemReference(params.id);
  const updateMutation = useUpdateProductionPlanItemReference();

  const handleSubmit = (formData: Partial<ProductionPlanItemReference>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan-item-reference") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan-item-reference")}>← Back</Button>
      <ProductionPlanItemReferenceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}