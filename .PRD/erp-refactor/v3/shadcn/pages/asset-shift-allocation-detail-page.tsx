"use client";

// Detail page for Asset Shift Allocation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetShiftAllocation, useUpdateAssetShiftAllocation } from "../hooks/asset-shift-allocation.hooks.js";
import { AssetShiftAllocationForm } from "../forms/asset-shift-allocation-form.js";
import type { AssetShiftAllocation } from "../types/asset-shift-allocation.js";
import { Button } from "@/components/ui/button";

export function AssetShiftAllocationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetShiftAllocation(params.id);
  const updateMutation = useUpdateAssetShiftAllocation();

  const handleSubmit = (formData: Partial<AssetShiftAllocation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-shift-allocation") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-shift-allocation")}>← Back</Button>
      <AssetShiftAllocationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}