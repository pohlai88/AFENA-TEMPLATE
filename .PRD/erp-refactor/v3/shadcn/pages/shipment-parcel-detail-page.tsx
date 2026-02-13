"use client";

// Detail page for Shipment Parcel
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShipmentParcel, useUpdateShipmentParcel } from "../hooks/shipment-parcel.hooks.js";
import { ShipmentParcelForm } from "../forms/shipment-parcel-form.js";
import type { ShipmentParcel } from "../types/shipment-parcel.js";
import { Button } from "@/components/ui/button";

export function ShipmentParcelDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShipmentParcel(params.id);
  const updateMutation = useUpdateShipmentParcel();

  const handleSubmit = (formData: Partial<ShipmentParcel>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shipment-parcel") },
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
      <Button variant="ghost" onClick={() => router.push("/shipment-parcel")}>← Back</Button>
      <ShipmentParcelForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}