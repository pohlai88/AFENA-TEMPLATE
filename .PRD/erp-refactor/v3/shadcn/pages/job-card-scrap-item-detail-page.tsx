"use client";

// Detail page for Job Card Scrap Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useJobCardScrapItem, useUpdateJobCardScrapItem } from "../hooks/job-card-scrap-item.hooks.js";
import { JobCardScrapItemForm } from "../forms/job-card-scrap-item-form.js";
import type { JobCardScrapItem } from "../types/job-card-scrap-item.js";
import { Button } from "@/components/ui/button";

export function JobCardScrapItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useJobCardScrapItem(params.id);
  const updateMutation = useUpdateJobCardScrapItem();

  const handleSubmit = (formData: Partial<JobCardScrapItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/job-card-scrap-item") },
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
      <Button variant="ghost" onClick={() => router.push("/job-card-scrap-item")}>← Back</Button>
      <JobCardScrapItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}