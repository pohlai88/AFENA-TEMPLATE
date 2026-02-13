"use client";

// Detail page for Depreciation Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDepreciationSchedule, useUpdateDepreciationSchedule } from "../hooks/depreciation-schedule.hooks.js";
import { DepreciationScheduleForm } from "../forms/depreciation-schedule-form.js";
import type { DepreciationSchedule } from "../types/depreciation-schedule.js";
import { Button } from "@/components/ui/button";

export function DepreciationScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDepreciationSchedule(params.id);
  const updateMutation = useUpdateDepreciationSchedule();

  const handleSubmit = (formData: Partial<DepreciationSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/depreciation-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/depreciation-schedule")}>← Back</Button>
      <DepreciationScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}