"use client";

// Detail page for Job Card Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJobCardItem, useUpdateJobCardItem } from "../hooks/job-card-item.hooks.js";
import { JobCardItemForm } from "../forms/job-card-item-form.js";
import type { JobCardItem } from "../types/job-card-item.js";
import { Button } from "@/components/ui/button";

export function JobCardItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJobCardItem(params.id);
  const updateMutation = useUpdateJobCardItem();

  const handleSubmit = (formData: Partial<JobCardItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/job-card-item") },
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
      <Button variant="ghost" onClick={() => router.push("/job-card-item")}>← Back</Button>
      <JobCardItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}