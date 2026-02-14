"use client";

// Detail page for Asset Movement Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetMovementItem, useUpdateAssetMovementItem } from "../hooks/asset-movement-item.hooks.js";
import { AssetMovementItemForm } from "../forms/asset-movement-item-form.js";
import type { AssetMovementItem } from "../types/asset-movement-item.js";
import { Button } from "@/components/ui/button";

export function AssetMovementItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetMovementItem(params.id);
  const updateMutation = useUpdateAssetMovementItem();

  const handleSubmit = (formData: Partial<AssetMovementItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-movement-item") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-movement-item")}>← Back</Button>
      <AssetMovementItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}