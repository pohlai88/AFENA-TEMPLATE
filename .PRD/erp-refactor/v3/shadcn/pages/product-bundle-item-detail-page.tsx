"use client";

// Detail page for Product Bundle Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductBundleItem, useUpdateProductBundleItem } from "../hooks/product-bundle-item.hooks.js";
import { ProductBundleItemForm } from "../forms/product-bundle-item-form.js";
import type { ProductBundleItem } from "../types/product-bundle-item.js";
import { Button } from "@/components/ui/button";

export function ProductBundleItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductBundleItem(params.id);
  const updateMutation = useUpdateProductBundleItem();

  const handleSubmit = (formData: Partial<ProductBundleItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/product-bundle-item") },
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
      <Button variant="ghost" onClick={() => router.push("/product-bundle-item")}>← Back</Button>
      <ProductBundleItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}