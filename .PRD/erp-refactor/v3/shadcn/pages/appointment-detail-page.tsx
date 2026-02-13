"use client";

// Detail page for Appointment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAppointment, useUpdateAppointment } from "../hooks/appointment.hooks.js";
import { AppointmentForm } from "../forms/appointment-form.js";
import type { Appointment } from "../types/appointment.js";
import { Button } from "@/components/ui/button";

export function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAppointment(params.id);
  const updateMutation = useUpdateAppointment();

  const handleSubmit = (formData: Partial<Appointment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/appointment") },
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
      <Button variant="ghost" onClick={() => router.push("/appointment")}>← Back</Button>
      <AppointmentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}