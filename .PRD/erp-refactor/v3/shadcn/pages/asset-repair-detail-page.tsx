"use client";

// Detail page for Asset Repair
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetRepair, useUpdateAssetRepair } from "../hooks/asset-repair.hooks.js";
import { AssetRepairForm } from "../forms/asset-repair-form.js";
import type { AssetRepair } from "../types/asset-repair.js";
import { Button } from "@/components/ui/button";

export function AssetRepairDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetRepair(params.id);
  const updateMutation = useUpdateAssetRepair();

  const handleSubmit = (formData: Partial<AssetRepair>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-repair") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-repair")}>← Back</Button>
      <AssetRepairForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}