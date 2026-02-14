"use client";

// Detail page for Packed Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePackedItem, useUpdatePackedItem } from "../hooks/packed-item.hooks.js";
import { PackedItemForm } from "../forms/packed-item-form.js";
import type { PackedItem } from "../types/packed-item.js";
import { Button } from "@/components/ui/button";

export function PackedItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePackedItem(params.id);
  const updateMutation = useUpdatePackedItem();

  const handleSubmit = (formData: Partial<PackedItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/packed-item") },
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
      <Button variant="ghost" onClick={() => router.push("/packed-item")}>← Back</Button>
      <PackedItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}