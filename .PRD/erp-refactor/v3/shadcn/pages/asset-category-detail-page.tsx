"use client";

// Detail page for Asset Category
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetCategory, useUpdateAssetCategory } from "../hooks/asset-category.hooks.js";
import { AssetCategoryForm } from "../forms/asset-category-form.js";
import type { AssetCategory } from "../types/asset-category.js";
import { Button } from "@/components/ui/button";

export function AssetCategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetCategory(params.id);
  const updateMutation = useUpdateAssetCategory();

  const handleSubmit = (formData: Partial<AssetCategory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-category") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-category")}>← Back</Button>
      <AssetCategoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}