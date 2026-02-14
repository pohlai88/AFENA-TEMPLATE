"use client";

// Detail page for Shipment Delivery Note
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShipmentDeliveryNote, useUpdateShipmentDeliveryNote } from "../hooks/shipment-delivery-note.hooks.js";
import { ShipmentDeliveryNoteForm } from "../forms/shipment-delivery-note-form.js";
import type { ShipmentDeliveryNote } from "../types/shipment-delivery-note.js";
import { Button } from "@/components/ui/button";

export function ShipmentDeliveryNoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShipmentDeliveryNote(params.id);
  const updateMutation = useUpdateShipmentDeliveryNote();

  const handleSubmit = (formData: Partial<ShipmentDeliveryNote>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shipment-delivery-note") },
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
      <Button variant="ghost" onClick={() => router.push("/shipment-delivery-note")}>← Back</Button>
      <ShipmentDeliveryNoteForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}