"use client";

// Detail page for Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItem, useUpdateItem } from "../hooks/item.hooks.js";
import { ItemForm } from "../forms/item-form.js";
import type { Item } from "../types/item.js";
import { Button } from "@/components/ui/button";

export function ItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItem(params.id);
  const updateMutation = useUpdateItem();

  const handleSubmit = (formData: Partial<Item>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item") },
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
      <Button variant="ghost" onClick={() => router.push("/item")}>← Back</Button>
      <ItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}