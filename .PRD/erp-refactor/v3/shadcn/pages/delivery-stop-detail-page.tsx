"use client";

// Detail page for Delivery Stop
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDeliveryStop, useUpdateDeliveryStop } from "../hooks/delivery-stop.hooks.js";
import { DeliveryStopForm } from "../forms/delivery-stop-form.js";
import type { DeliveryStop } from "../types/delivery-stop.js";
import { Button } from "@/components/ui/button";

export function DeliveryStopDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDeliveryStop(params.id);
  const updateMutation = useUpdateDeliveryStop();

  const handleSubmit = (formData: Partial<DeliveryStop>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/delivery-stop") },
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
      <Button variant="ghost" onClick={() => router.push("/delivery-stop")}>← Back</Button>
      <DeliveryStopForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}