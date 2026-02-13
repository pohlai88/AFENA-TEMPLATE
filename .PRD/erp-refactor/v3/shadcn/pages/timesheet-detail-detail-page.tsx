"use client";

// Detail page for Timesheet Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTimesheetDetail, useUpdateTimesheetDetail } from "../hooks/timesheet-detail.hooks.js";
import { TimesheetDetailForm } from "../forms/timesheet-detail-form.js";
import type { TimesheetDetail } from "../types/timesheet-detail.js";
import { Button } from "@/components/ui/button";

export function TimesheetDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTimesheetDetail(params.id);
  const updateMutation = useUpdateTimesheetDetail();

  const handleSubmit = (formData: Partial<TimesheetDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/timesheet-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/timesheet-detail")}>← Back</Button>
      <TimesheetDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}