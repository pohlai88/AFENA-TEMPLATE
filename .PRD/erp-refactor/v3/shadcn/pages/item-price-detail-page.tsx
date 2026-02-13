"use client";

// Detail page for Item Price
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemPrice, useUpdateItemPrice } from "../hooks/item-price.hooks.js";
import { ItemPriceForm } from "../forms/item-price-form.js";
import type { ItemPrice } from "../types/item-price.js";
import { Button } from "@/components/ui/button";

export function ItemPriceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemPrice(params.id);
  const updateMutation = useUpdateItemPrice();

  const handleSubmit = (formData: Partial<ItemPrice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-price") },
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
      <Button variant="ghost" onClick={() => router.push("/item-price")}>← Back</Button>
      <ItemPriceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}