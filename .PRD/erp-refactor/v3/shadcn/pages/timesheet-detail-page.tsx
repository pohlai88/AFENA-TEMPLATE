"use client";

// Detail page for Timesheet
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTimesheet, useUpdateTimesheet } from "../hooks/timesheet.hooks.js";
import { TimesheetForm } from "../forms/timesheet-form.js";
import type { Timesheet } from "../types/timesheet.js";
import { Button } from "@/components/ui/button";

export function TimesheetDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTimesheet(params.id);
  const updateMutation = useUpdateTimesheet();

  const handleSubmit = (formData: Partial<Timesheet>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/timesheet") },
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
      <Button variant="ghost" onClick={() => router.push("/timesheet")}>← Back</Button>
      <TimesheetForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}