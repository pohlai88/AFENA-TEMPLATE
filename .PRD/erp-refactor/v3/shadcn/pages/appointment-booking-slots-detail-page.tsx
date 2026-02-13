"use client";

// Detail page for Appointment Booking Slots
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAppointmentBookingSlots, useUpdateAppointmentBookingSlots } from "../hooks/appointment-booking-slots.hooks.js";
import { AppointmentBookingSlotsForm } from "../forms/appointment-booking-slots-form.js";
import type { AppointmentBookingSlots } from "../types/appointment-booking-slots.js";
import { Button } from "@/components/ui/button";

export function AppointmentBookingSlotsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAppointmentBookingSlots(params.id);
  const updateMutation = useUpdateAppointmentBookingSlots();

  const handleSubmit = (formData: Partial<AppointmentBookingSlots>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/appointment-booking-slots") },
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
      <Button variant="ghost" onClick={() => router.push("/appointment-booking-slots")}>← Back</Button>
      <AppointmentBookingSlotsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}