"use client";

// Detail page for Maintenance Schedule Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaintenanceScheduleDetail, useUpdateMaintenanceScheduleDetail } from "../hooks/maintenance-schedule-detail.hooks.js";
import { MaintenanceScheduleDetailForm } from "../forms/maintenance-schedule-detail-form.js";
import type { MaintenanceScheduleDetail } from "../types/maintenance-schedule-detail.js";
import { Button } from "@/components/ui/button";

export function MaintenanceScheduleDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaintenanceScheduleDetail(params.id);
  const updateMutation = useUpdateMaintenanceScheduleDetail();

  const handleSubmit = (formData: Partial<MaintenanceScheduleDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/maintenance-schedule-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/maintenance-schedule-detail")}>← Back</Button>
      <MaintenanceScheduleDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}