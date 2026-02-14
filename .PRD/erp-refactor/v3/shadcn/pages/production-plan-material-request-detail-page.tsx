"use client";

// Detail page for Production Plan Material Request
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlanMaterialRequest, useUpdateProductionPlanMaterialRequest } from "../hooks/production-plan-material-request.hooks.js";
import { ProductionPlanMaterialRequestForm } from "../forms/production-plan-material-request-form.js";
import type { ProductionPlanMaterialRequest } from "../types/production-plan-material-request.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanMaterialRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlanMaterialRequest(params.id);
  const updateMutation = useUpdateProductionPlanMaterialRequest();

  const handleSubmit = (formData: Partial<ProductionPlanMaterialRequest>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan-material-request") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan-material-request")}>← Back</Button>
      <ProductionPlanMaterialRequestForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}