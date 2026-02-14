"use client";

// Detail page for Asset Capitalization Asset Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetCapitalizationAssetItem, useUpdateAssetCapitalizationAssetItem } from "../hooks/asset-capitalization-asset-item.hooks.js";
import { AssetCapitalizationAssetItemForm } from "../forms/asset-capitalization-asset-item-form.js";
import type { AssetCapitalizationAssetItem } from "../types/asset-capitalization-asset-item.js";
import { Button } from "@/components/ui/button";

export function AssetCapitalizationAssetItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetCapitalizationAssetItem(params.id);
  const updateMutation = useUpdateAssetCapitalizationAssetItem();

  const handleSubmit = (formData: Partial<AssetCapitalizationAssetItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-capitalization-asset-item") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-capitalization-asset-item")}>← Back</Button>
      <AssetCapitalizationAssetItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}