"use client";

// Detail page for Delivery Trip
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDeliveryTrip, useUpdateDeliveryTrip } from "../hooks/delivery-trip.hooks.js";
import { DeliveryTripForm } from "../forms/delivery-trip-form.js";
import type { DeliveryTrip } from "../types/delivery-trip.js";
import { Button } from "@/components/ui/button";

export function DeliveryTripDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDeliveryTrip(params.id);
  const updateMutation = useUpdateDeliveryTrip();

  const handleSubmit = (formData: Partial<DeliveryTrip>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/delivery-trip") },
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
      <Button variant="ghost" onClick={() => router.push("/delivery-trip")}>← Back</Button>
      <DeliveryTripForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}