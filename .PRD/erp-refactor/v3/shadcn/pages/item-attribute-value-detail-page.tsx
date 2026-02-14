"use client";

// Detail page for Item Attribute Value
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemAttributeValue, useUpdateItemAttributeValue } from "../hooks/item-attribute-value.hooks.js";
import { ItemAttributeValueForm } from "../forms/item-attribute-value-form.js";
import type { ItemAttributeValue } from "../types/item-attribute-value.js";
import { Button } from "@/components/ui/button";

export function ItemAttributeValueDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemAttributeValue(params.id);
  const updateMutation = useUpdateItemAttributeValue();

  const handleSubmit = (formData: Partial<ItemAttributeValue>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-attribute-value") },
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
      <Button variant="ghost" onClick={() => router.push("/item-attribute-value")}>← Back</Button>
      <ItemAttributeValueForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}