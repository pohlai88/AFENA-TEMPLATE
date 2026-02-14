"use client";

// Detail page for Master Production Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMasterProductionSchedule, useUpdateMasterProductionSchedule } from "../hooks/master-production-schedule.hooks.js";
import { MasterProductionScheduleForm } from "../forms/master-production-schedule-form.js";
import type { MasterProductionSchedule } from "../types/master-production-schedule.js";
import { Button } from "@/components/ui/button";

export function MasterProductionScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMasterProductionSchedule(params.id);
  const updateMutation = useUpdateMasterProductionSchedule();

  const handleSubmit = (formData: Partial<MasterProductionSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/master-production-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/master-production-schedule")}>← Back</Button>
      <MasterProductionScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}