"use client";

// Detail page for Asset Capitalization Service Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetCapitalizationServiceItem, useUpdateAssetCapitalizationServiceItem } from "../hooks/asset-capitalization-service-item.hooks.js";
import { AssetCapitalizationServiceItemForm } from "../forms/asset-capitalization-service-item-form.js";
import type { AssetCapitalizationServiceItem } from "../types/asset-capitalization-service-item.js";
import { Button } from "@/components/ui/button";

export function AssetCapitalizationServiceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetCapitalizationServiceItem(params.id);
  const updateMutation = useUpdateAssetCapitalizationServiceItem();

  const handleSubmit = (formData: Partial<AssetCapitalizationServiceItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-capitalization-service-item") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-capitalization-service-item")}>← Back</Button>
      <AssetCapitalizationServiceItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}