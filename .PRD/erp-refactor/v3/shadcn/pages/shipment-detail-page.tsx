"use client";

// Detail page for Shipment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShipment, useUpdateShipment } from "../hooks/shipment.hooks.js";
import { ShipmentForm } from "../forms/shipment-form.js";
import type { Shipment } from "../types/shipment.js";
import { Button } from "@/components/ui/button";

export function ShipmentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShipment(params.id);
  const updateMutation = useUpdateShipment();

  const handleSubmit = (formData: Partial<Shipment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shipment") },
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
      <Button variant="ghost" onClick={() => router.push("/shipment")}>← Back</Button>
      <ShipmentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}