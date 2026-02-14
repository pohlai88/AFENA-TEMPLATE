"use client";

// Detail page for Asset Maintenance Task
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetMaintenanceTask, useUpdateAssetMaintenanceTask } from "../hooks/asset-maintenance-task.hooks.js";
import { AssetMaintenanceTaskForm } from "../forms/asset-maintenance-task-form.js";
import type { AssetMaintenanceTask } from "../types/asset-maintenance-task.js";
import { Button } from "@/components/ui/button";

export function AssetMaintenanceTaskDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetMaintenanceTask(params.id);
  const updateMutation = useUpdateAssetMaintenanceTask();

  const handleSubmit = (formData: Partial<AssetMaintenanceTask>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-maintenance-task") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-maintenance-task")}>← Back</Button>
      <AssetMaintenanceTaskForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}