"use client";

// Detail page for Item Variant
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemVariant, useUpdateItemVariant } from "../hooks/item-variant.hooks.js";
import { ItemVariantForm } from "../forms/item-variant-form.js";
import type { ItemVariant } from "../types/item-variant.js";
import { Button } from "@/components/ui/button";

export function ItemVariantDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemVariant(params.id);
  const updateMutation = useUpdateItemVariant();

  const handleSubmit = (formData: Partial<ItemVariant>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-variant") },
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
      <Button variant="ghost" onClick={() => router.push("/item-variant")}>← Back</Button>
      <ItemVariantForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}