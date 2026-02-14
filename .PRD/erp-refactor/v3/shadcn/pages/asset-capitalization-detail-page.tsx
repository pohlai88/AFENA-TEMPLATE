"use client";

// Detail page for Asset Capitalization
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetCapitalization, useUpdateAssetCapitalization } from "../hooks/asset-capitalization.hooks.js";
import { AssetCapitalizationForm } from "../forms/asset-capitalization-form.js";
import type { AssetCapitalization } from "../types/asset-capitalization.js";
import { Button } from "@/components/ui/button";

export function AssetCapitalizationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetCapitalization(params.id);
  const updateMutation = useUpdateAssetCapitalization();

  const handleSubmit = (formData: Partial<AssetCapitalization>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-capitalization") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-capitalization")}>← Back</Button>
      <AssetCapitalizationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}