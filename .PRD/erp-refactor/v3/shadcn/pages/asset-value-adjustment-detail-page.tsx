"use client";

// Detail page for Asset Value Adjustment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetValueAdjustment, useUpdateAssetValueAdjustment } from "../hooks/asset-value-adjustment.hooks.js";
import { AssetValueAdjustmentForm } from "../forms/asset-value-adjustment-form.js";
import type { AssetValueAdjustment } from "../types/asset-value-adjustment.js";
import { Button } from "@/components/ui/button";

export function AssetValueAdjustmentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetValueAdjustment(params.id);
  const updateMutation = useUpdateAssetValueAdjustment();

  const handleSubmit = (formData: Partial<AssetValueAdjustment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-value-adjustment") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-value-adjustment")}>← Back</Button>
      <AssetValueAdjustmentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}