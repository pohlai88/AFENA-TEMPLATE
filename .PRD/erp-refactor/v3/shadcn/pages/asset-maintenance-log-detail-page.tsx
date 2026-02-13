"use client";

// Detail page for Asset Maintenance Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetMaintenanceLog, useUpdateAssetMaintenanceLog } from "../hooks/asset-maintenance-log.hooks.js";
import { AssetMaintenanceLogForm } from "../forms/asset-maintenance-log-form.js";
import type { AssetMaintenanceLog } from "../types/asset-maintenance-log.js";
import { Button } from "@/components/ui/button";

export function AssetMaintenanceLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetMaintenanceLog(params.id);
  const updateMutation = useUpdateAssetMaintenanceLog();

  const handleSubmit = (formData: Partial<AssetMaintenanceLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-maintenance-log") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-maintenance-log")}>← Back</Button>
      <AssetMaintenanceLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}