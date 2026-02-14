"use client";

// Detail page for Serial and Batch Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSerialAndBatchEntry, useUpdateSerialAndBatchEntry } from "../hooks/serial-and-batch-entry.hooks.js";
import { SerialAndBatchEntryForm } from "../forms/serial-and-batch-entry-form.js";
import type { SerialAndBatchEntry } from "../types/serial-and-batch-entry.js";
import { Button } from "@/components/ui/button";

export function SerialAndBatchEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSerialAndBatchEntry(params.id);
  const updateMutation = useUpdateSerialAndBatchEntry();

  const handleSubmit = (formData: Partial<SerialAndBatchEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/serial-and-batch-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/serial-and-batch-entry")}>← Back</Button>
      <SerialAndBatchEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}