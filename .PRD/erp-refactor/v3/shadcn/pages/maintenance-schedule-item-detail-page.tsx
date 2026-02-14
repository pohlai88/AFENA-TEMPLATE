"use client";

// Detail page for Maintenance Schedule Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaintenanceScheduleItem, useUpdateMaintenanceScheduleItem } from "../hooks/maintenance-schedule-item.hooks.js";
import { MaintenanceScheduleItemForm } from "../forms/maintenance-schedule-item-form.js";
import type { MaintenanceScheduleItem } from "../types/maintenance-schedule-item.js";
import { Button } from "@/components/ui/button";

export function MaintenanceScheduleItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaintenanceScheduleItem(params.id);
  const updateMutation = useUpdateMaintenanceScheduleItem();

  const handleSubmit = (formData: Partial<MaintenanceScheduleItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/maintenance-schedule-item") },
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
      <Button variant="ghost" onClick={() => router.push("/maintenance-schedule-item")}>← Back</Button>
      <MaintenanceScheduleItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}