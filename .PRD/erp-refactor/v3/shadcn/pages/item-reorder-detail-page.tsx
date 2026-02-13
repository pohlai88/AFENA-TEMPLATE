"use client";

// Detail page for Item Reorder
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemReorder, useUpdateItemReorder } from "../hooks/item-reorder.hooks.js";
import { ItemReorderForm } from "../forms/item-reorder-form.js";
import type { ItemReorder } from "../types/item-reorder.js";
import { Button } from "@/components/ui/button";

export function ItemReorderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemReorder(params.id);
  const updateMutation = useUpdateItemReorder();

  const handleSubmit = (formData: Partial<ItemReorder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-reorder") },
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
      <Button variant="ghost" onClick={() => router.push("/item-reorder")}>← Back</Button>
      <ItemReorderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}