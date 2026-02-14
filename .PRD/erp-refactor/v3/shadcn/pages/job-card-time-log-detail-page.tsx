"use client";

// Detail page for Job Card Time Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJobCardTimeLog, useUpdateJobCardTimeLog } from "../hooks/job-card-time-log.hooks.js";
import { JobCardTimeLogForm } from "../forms/job-card-time-log-form.js";
import type { JobCardTimeLog } from "../types/job-card-time-log.js";
import { Button } from "@/components/ui/button";

export function JobCardTimeLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJobCardTimeLog(params.id);
  const updateMutation = useUpdateJobCardTimeLog();

  const handleSubmit = (formData: Partial<JobCardTimeLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/job-card-time-log") },
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
      <Button variant="ghost" onClick={() => router.push("/job-card-time-log")}>← Back</Button>
      <JobCardTimeLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}