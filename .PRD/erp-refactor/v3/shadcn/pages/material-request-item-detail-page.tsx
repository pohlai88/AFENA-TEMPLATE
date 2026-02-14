"use client";

// Detail page for Material Request Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaterialRequestItem, useUpdateMaterialRequestItem } from "../hooks/material-request-item.hooks.js";
import { MaterialRequestItemForm } from "../forms/material-request-item-form.js";
import type { MaterialRequestItem } from "../types/material-request-item.js";
import { Button } from "@/components/ui/button";

export function MaterialRequestItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaterialRequestItem(params.id);
  const updateMutation = useUpdateMaterialRequestItem();

  const handleSubmit = (formData: Partial<MaterialRequestItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/material-request-item") },
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
      <Button variant="ghost" onClick={() => router.push("/material-request-item")}>← Back</Button>
      <MaterialRequestItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}