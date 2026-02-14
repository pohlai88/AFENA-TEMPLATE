"use client";

// Detail page for Asset Movement
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetMovement, useUpdateAssetMovement } from "../hooks/asset-movement.hooks.js";
import { AssetMovementForm } from "../forms/asset-movement-form.js";
import type { AssetMovement } from "../types/asset-movement.js";
import { Button } from "@/components/ui/button";

export function AssetMovementDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetMovement(params.id);
  const updateMutation = useUpdateAssetMovement();

  const handleSubmit = (formData: Partial<AssetMovement>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-movement") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-movement")}>← Back</Button>
      <AssetMovementForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}