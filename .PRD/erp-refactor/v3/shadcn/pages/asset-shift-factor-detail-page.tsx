"use client";

// Detail page for Asset Shift Factor
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetShiftFactor, useUpdateAssetShiftFactor } from "../hooks/asset-shift-factor.hooks.js";
import { AssetShiftFactorForm } from "../forms/asset-shift-factor-form.js";
import type { AssetShiftFactor } from "../types/asset-shift-factor.js";
import { Button } from "@/components/ui/button";

export function AssetShiftFactorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetShiftFactor(params.id);
  const updateMutation = useUpdateAssetShiftFactor();

  const handleSubmit = (formData: Partial<AssetShiftFactor>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-shift-factor") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-shift-factor")}>← Back</Button>
      <AssetShiftFactorForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}