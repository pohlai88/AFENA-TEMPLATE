"use client";

// Detail page for Asset
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAsset, useUpdateAsset } from "../hooks/asset.hooks.js";
import { AssetForm } from "../forms/asset-form.js";
import type { Asset } from "../types/asset.js";
import { Button } from "@/components/ui/button";

export function AssetDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAsset(params.id);
  const updateMutation = useUpdateAsset();

  const handleSubmit = (formData: Partial<Asset>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset") },
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
      <Button variant="ghost" onClick={() => router.push("/asset")}>← Back</Button>
      <AssetForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}