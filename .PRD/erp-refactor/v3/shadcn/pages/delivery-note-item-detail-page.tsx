"use client";

// Detail page for Delivery Note Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDeliveryNoteItem, useUpdateDeliveryNoteItem } from "../hooks/delivery-note-item.hooks.js";
import { DeliveryNoteItemForm } from "../forms/delivery-note-item-form.js";
import type { DeliveryNoteItem } from "../types/delivery-note-item.js";
import { Button } from "@/components/ui/button";

export function DeliveryNoteItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDeliveryNoteItem(params.id);
  const updateMutation = useUpdateDeliveryNoteItem();

  const handleSubmit = (formData: Partial<DeliveryNoteItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/delivery-note-item") },
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
      <Button variant="ghost" onClick={() => router.push("/delivery-note-item")}>← Back</Button>
      <DeliveryNoteItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}