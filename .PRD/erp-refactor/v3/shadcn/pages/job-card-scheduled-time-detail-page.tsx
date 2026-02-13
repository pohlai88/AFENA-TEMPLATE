"use client";

// Detail page for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJobCardScheduledTime, useUpdateJobCardScheduledTime } from "../hooks/job-card-scheduled-time.hooks.js";
import { JobCardScheduledTimeForm } from "../forms/job-card-scheduled-time-form.js";
import type { JobCardScheduledTime } from "../types/job-card-scheduled-time.js";
import { Button } from "@/components/ui/button";

export function JobCardScheduledTimeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJobCardScheduledTime(params.id);
  const updateMutation = useUpdateJobCardScheduledTime();

  const handleSubmit = (formData: Partial<JobCardScheduledTime>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/job-card-scheduled-time") },
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
      <Button variant="ghost" onClick={() => router.push("/job-card-scheduled-time")}>← Back</Button>
      <JobCardScheduledTimeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}