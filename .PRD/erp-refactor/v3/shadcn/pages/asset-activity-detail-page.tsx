"use client";

// Detail page for Asset Activity
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetActivity, useUpdateAssetActivity } from "../hooks/asset-activity.hooks.js";
import { AssetActivityForm } from "../forms/asset-activity-form.js";
import type { AssetActivity } from "../types/asset-activity.js";
import { Button } from "@/components/ui/button";

export function AssetActivityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetActivity(params.id);
  const updateMutation = useUpdateAssetActivity();

  const handleSubmit = (formData: Partial<AssetActivity>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-activity") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-activity")}>← Back</Button>
      <AssetActivityForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}