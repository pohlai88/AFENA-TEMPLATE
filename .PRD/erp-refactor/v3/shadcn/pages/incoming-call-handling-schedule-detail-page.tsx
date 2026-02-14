"use client";

// Detail page for Incoming Call Handling Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useIncomingCallHandlingSchedule, useUpdateIncomingCallHandlingSchedule } from "../hooks/incoming-call-handling-schedule.hooks.js";
import { IncomingCallHandlingScheduleForm } from "../forms/incoming-call-handling-schedule-form.js";
import type { IncomingCallHandlingSchedule } from "../types/incoming-call-handling-schedule.js";
import { Button } from "@/components/ui/button";

export function IncomingCallHandlingScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useIncomingCallHandlingSchedule(params.id);
  const updateMutation = useUpdateIncomingCallHandlingSchedule();

  const handleSubmit = (formData: Partial<IncomingCallHandlingSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/incoming-call-handling-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/incoming-call-handling-schedule")}>← Back</Button>
      <IncomingCallHandlingScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}