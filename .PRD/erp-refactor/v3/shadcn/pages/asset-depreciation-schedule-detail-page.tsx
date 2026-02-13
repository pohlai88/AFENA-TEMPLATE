"use client";

// Detail page for Asset Depreciation Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetDepreciationSchedule, useUpdateAssetDepreciationSchedule } from "../hooks/asset-depreciation-schedule.hooks.js";
import { AssetDepreciationScheduleForm } from "../forms/asset-depreciation-schedule-form.js";
import type { AssetDepreciationSchedule } from "../types/asset-depreciation-schedule.js";
import { Button } from "@/components/ui/button";

export function AssetDepreciationScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetDepreciationSchedule(params.id);
  const updateMutation = useUpdateAssetDepreciationSchedule();

  const handleSubmit = (formData: Partial<AssetDepreciationSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-depreciation-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-depreciation-schedule")}>← Back</Button>
      <AssetDepreciationScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}