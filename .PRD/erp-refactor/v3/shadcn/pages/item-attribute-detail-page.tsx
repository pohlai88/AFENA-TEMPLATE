"use client";

// Detail page for Item Attribute
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemAttribute, useUpdateItemAttribute } from "../hooks/item-attribute.hooks.js";
import { ItemAttributeForm } from "../forms/item-attribute-form.js";
import type { ItemAttribute } from "../types/item-attribute.js";
import { Button } from "@/components/ui/button";

export function ItemAttributeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemAttribute(params.id);
  const updateMutation = useUpdateItemAttribute();

  const handleSubmit = (formData: Partial<ItemAttribute>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-attribute") },
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
      <Button variant="ghost" onClick={() => router.push("/item-attribute")}>← Back</Button>
      <ItemAttributeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}