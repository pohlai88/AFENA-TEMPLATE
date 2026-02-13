"use client";

// Detail page for Job Card
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJobCard, useUpdateJobCard } from "../hooks/job-card.hooks.js";
import { JobCardForm } from "../forms/job-card-form.js";
import type { JobCard } from "../types/job-card.js";
import { Button } from "@/components/ui/button";

export function JobCardDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJobCard(params.id);
  const updateMutation = useUpdateJobCard();

  const handleSubmit = (formData: Partial<JobCard>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/job-card") },
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
      <Button variant="ghost" onClick={() => router.push("/job-card")}>← Back</Button>
      <JobCardForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}