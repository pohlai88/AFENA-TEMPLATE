"use client";

// Detail page for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemQualityInspectionParameter, useUpdateItemQualityInspectionParameter } from "../hooks/item-quality-inspection-parameter.hooks.js";
import { ItemQualityInspectionParameterForm } from "../forms/item-quality-inspection-parameter-form.js";
import type { ItemQualityInspectionParameter } from "../types/item-quality-inspection-parameter.js";
import { Button } from "@/components/ui/button";

export function ItemQualityInspectionParameterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemQualityInspectionParameter(params.id);
  const updateMutation = useUpdateItemQualityInspectionParameter();

  const handleSubmit = (formData: Partial<ItemQualityInspectionParameter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-quality-inspection-parameter") },
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
      <Button variant="ghost" onClick={() => router.push("/item-quality-inspection-parameter")}>← Back</Button>
      <ItemQualityInspectionParameterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}