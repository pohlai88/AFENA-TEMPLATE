"use client";

// Detail page for Asset Category Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetCategoryAccount, useUpdateAssetCategoryAccount } from "../hooks/asset-category-account.hooks.js";
import { AssetCategoryAccountForm } from "../forms/asset-category-account-form.js";
import type { AssetCategoryAccount } from "../types/asset-category-account.js";
import { Button } from "@/components/ui/button";

export function AssetCategoryAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetCategoryAccount(params.id);
  const updateMutation = useUpdateAssetCategoryAccount();

  const handleSubmit = (formData: Partial<AssetCategoryAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-category-account") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-category-account")}>← Back</Button>
      <AssetCategoryAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}