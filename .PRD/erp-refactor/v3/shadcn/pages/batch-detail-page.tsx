"use client";

// Detail page for Batch
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBatch, useUpdateBatch } from "../hooks/batch.hooks.js";
import { BatchForm } from "../forms/batch-form.js";
import type { Batch } from "../types/batch.js";
import { Button } from "@/components/ui/button";

export function BatchDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBatch(params.id);
  const updateMutation = useUpdateBatch();

  const handleSubmit = (formData: Partial<Batch>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/batch") },
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
      <Button variant="ghost" onClick={() => router.push("/batch")}>← Back</Button>
      <BatchForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}