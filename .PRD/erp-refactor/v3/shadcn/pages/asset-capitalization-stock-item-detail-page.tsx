"use client";

// Detail page for Asset Capitalization Stock Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetCapitalizationStockItem, useUpdateAssetCapitalizationStockItem } from "../hooks/asset-capitalization-stock-item.hooks.js";
import { AssetCapitalizationStockItemForm } from "../forms/asset-capitalization-stock-item-form.js";
import type { AssetCapitalizationStockItem } from "../types/asset-capitalization-stock-item.js";
import { Button } from "@/components/ui/button";

export function AssetCapitalizationStockItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetCapitalizationStockItem(params.id);
  const updateMutation = useUpdateAssetCapitalizationStockItem();

  const handleSubmit = (formData: Partial<AssetCapitalizationStockItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-capitalization-stock-item") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-capitalization-stock-item")}>← Back</Button>
      <AssetCapitalizationStockItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}