"use client";

// Detail page for Item Variant Attribute
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemVariantAttribute, useUpdateItemVariantAttribute } from "../hooks/item-variant-attribute.hooks.js";
import { ItemVariantAttributeForm } from "../forms/item-variant-attribute-form.js";
import type { ItemVariantAttribute } from "../types/item-variant-attribute.js";
import { Button } from "@/components/ui/button";

export function ItemVariantAttributeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemVariantAttribute(params.id);
  const updateMutation = useUpdateItemVariantAttribute();

  const handleSubmit = (formData: Partial<ItemVariantAttribute>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-variant-attribute") },
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
      <Button variant="ghost" onClick={() => router.push("/item-variant-attribute")}>← Back</Button>
      <ItemVariantAttributeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}