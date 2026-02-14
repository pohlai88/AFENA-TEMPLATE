"use client";

// Detail page for Delivery Schedule Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDeliveryScheduleItem, useUpdateDeliveryScheduleItem } from "../hooks/delivery-schedule-item.hooks.js";
import { DeliveryScheduleItemForm } from "../forms/delivery-schedule-item-form.js";
import type { DeliveryScheduleItem } from "../types/delivery-schedule-item.js";
import { Button } from "@/components/ui/button";

export function DeliveryScheduleItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDeliveryScheduleItem(params.id);
  const updateMutation = useUpdateDeliveryScheduleItem();

  const handleSubmit = (formData: Partial<DeliveryScheduleItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/delivery-schedule-item") },
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
      <Button variant="ghost" onClick={() => router.push("/delivery-schedule-item")}>← Back</Button>
      <DeliveryScheduleItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}