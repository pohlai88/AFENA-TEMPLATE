"use client";

// Detail page for Maintenance Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaintenanceSchedule, useUpdateMaintenanceSchedule } from "../hooks/maintenance-schedule.hooks.js";
import { MaintenanceScheduleForm } from "../forms/maintenance-schedule-form.js";
import type { MaintenanceSchedule } from "../types/maintenance-schedule.js";
import { Button } from "@/components/ui/button";

export function MaintenanceScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaintenanceSchedule(params.id);
  const updateMutation = useUpdateMaintenanceSchedule();

  const handleSubmit = (formData: Partial<MaintenanceSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/maintenance-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/maintenance-schedule")}>← Back</Button>
      <MaintenanceScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}