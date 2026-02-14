"use client";

// Detail page for Product Bundle
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductBundle, useUpdateProductBundle } from "../hooks/product-bundle.hooks.js";
import { ProductBundleForm } from "../forms/product-bundle-form.js";
import type { ProductBundle } from "../types/product-bundle.js";
import { Button } from "@/components/ui/button";

export function ProductBundleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductBundle(params.id);
  const updateMutation = useUpdateProductBundle();

  const handleSubmit = (formData: Partial<ProductBundle>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/product-bundle") },
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
      <Button variant="ghost" onClick={() => router.push("/product-bundle")}>← Back</Button>
      <ProductBundleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}