"use client";

// Detail page for Appointment Booking Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAppointmentBookingSettings, useUpdateAppointmentBookingSettings } from "../hooks/appointment-booking-settings.hooks.js";
import { AppointmentBookingSettingsForm } from "../forms/appointment-booking-settings-form.js";
import type { AppointmentBookingSettings } from "../types/appointment-booking-settings.js";
import { Button } from "@/components/ui/button";

export function AppointmentBookingSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAppointmentBookingSettings(params.id);
  const updateMutation = useUpdateAppointmentBookingSettings();

  const handleSubmit = (formData: Partial<AppointmentBookingSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/appointment-booking-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/appointment-booking-settings")}>← Back</Button>
      <AppointmentBookingSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}