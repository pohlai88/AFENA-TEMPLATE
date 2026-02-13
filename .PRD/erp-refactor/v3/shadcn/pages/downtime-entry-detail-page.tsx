"use client";

// Detail page for Downtime Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDowntimeEntry, useUpdateDowntimeEntry } from "../hooks/downtime-entry.hooks.js";
import { DowntimeEntryForm } from "../forms/downtime-entry-form.js";
import type { DowntimeEntry } from "../types/downtime-entry.js";
import { Button } from "@/components/ui/button";

export function DowntimeEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDowntimeEntry(params.id);
  const updateMutation = useUpdateDowntimeEntry();

  const handleSubmit = (formData: Partial<DowntimeEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/downtime-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/downtime-entry")}>← Back</Button>
      <DowntimeEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}