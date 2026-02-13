"use client";

// Detail page for Availability Of Slots
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAvailabilityOfSlots, useUpdateAvailabilityOfSlots } from "../hooks/availability-of-slots.hooks.js";
import { AvailabilityOfSlotsForm } from "../forms/availability-of-slots-form.js";
import type { AvailabilityOfSlots } from "../types/availability-of-slots.js";
import { Button } from "@/components/ui/button";

export function AvailabilityOfSlotsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAvailabilityOfSlots(params.id);
  const updateMutation = useUpdateAvailabilityOfSlots();

  const handleSubmit = (formData: Partial<AvailabilityOfSlots>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/availability-of-slots") },
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
      <Button variant="ghost" onClick={() => router.push("/availability-of-slots")}>← Back</Button>
      <AvailabilityOfSlotsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}