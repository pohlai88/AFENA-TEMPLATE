"use client";

// Detail page for Inventory Dimension
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useInventoryDimension, useUpdateInventoryDimension } from "../hooks/inventory-dimension.hooks.js";
import { InventoryDimensionForm } from "../forms/inventory-dimension-form.js";
import type { InventoryDimension } from "../types/inventory-dimension.js";
import { Button } from "@/components/ui/button";

export function InventoryDimensionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useInventoryDimension(params.id);
  const updateMutation = useUpdateInventoryDimension();

  const handleSubmit = (formData: Partial<InventoryDimension>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/inventory-dimension") },
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
      <Button variant="ghost" onClick={() => router.push("/inventory-dimension")}>← Back</Button>
      <InventoryDimensionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}