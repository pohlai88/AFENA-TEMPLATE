"use client";

// Detail page for Delivery Note
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDeliveryNote, useUpdateDeliveryNote } from "../hooks/delivery-note.hooks.js";
import { DeliveryNoteForm } from "../forms/delivery-note-form.js";
import type { DeliveryNote } from "../types/delivery-note.js";
import { Button } from "@/components/ui/button";

export function DeliveryNoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDeliveryNote(params.id);
  const updateMutation = useUpdateDeliveryNote();

  const handleSubmit = (formData: Partial<DeliveryNote>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/delivery-note") },
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
      <Button variant="ghost" onClick={() => router.push("/delivery-note")}>← Back</Button>
      <DeliveryNoteForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}