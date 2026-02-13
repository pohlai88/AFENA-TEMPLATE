"use client";

// Detail page for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetRepairConsumedItem, useUpdateAssetRepairConsumedItem } from "../hooks/asset-repair-consumed-item.hooks.js";
import { AssetRepairConsumedItemForm } from "../forms/asset-repair-consumed-item-form.js";
import type { AssetRepairConsumedItem } from "../types/asset-repair-consumed-item.js";
import { Button } from "@/components/ui/button";

export function AssetRepairConsumedItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetRepairConsumedItem(params.id);
  const updateMutation = useUpdateAssetRepairConsumedItem();

  const handleSubmit = (formData: Partial<AssetRepairConsumedItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-repair-consumed-item") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-repair-consumed-item")}>← Back</Button>
      <AssetRepairConsumedItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}