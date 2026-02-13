"use client";

// Detail page for Material Request Plan Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaterialRequestPlanItem, useUpdateMaterialRequestPlanItem } from "../hooks/material-request-plan-item.hooks.js";
import { MaterialRequestPlanItemForm } from "../forms/material-request-plan-item-form.js";
import type { MaterialRequestPlanItem } from "../types/material-request-plan-item.js";
import { Button } from "@/components/ui/button";

export function MaterialRequestPlanItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaterialRequestPlanItem(params.id);
  const updateMutation = useUpdateMaterialRequestPlanItem();

  const handleSubmit = (formData: Partial<MaterialRequestPlanItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/material-request-plan-item") },
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
      <Button variant="ghost" onClick={() => router.push("/material-request-plan-item")}>← Back</Button>
      <MaterialRequestPlanItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}