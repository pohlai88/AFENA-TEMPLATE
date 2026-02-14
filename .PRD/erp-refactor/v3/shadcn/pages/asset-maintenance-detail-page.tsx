"use client";

// Detail page for Asset Maintenance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetMaintenance, useUpdateAssetMaintenance } from "../hooks/asset-maintenance.hooks.js";
import { AssetMaintenanceForm } from "../forms/asset-maintenance-form.js";
import type { AssetMaintenance } from "../types/asset-maintenance.js";
import { Button } from "@/components/ui/button";

export function AssetMaintenanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetMaintenance(params.id);
  const updateMutation = useUpdateAssetMaintenance();

  const handleSubmit = (formData: Partial<AssetMaintenance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-maintenance") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-maintenance")}>← Back</Button>
      <AssetMaintenanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}