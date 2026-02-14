"use client";

// Detail page for Serial and Batch Bundle
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSerialAndBatchBundle, useUpdateSerialAndBatchBundle } from "../hooks/serial-and-batch-bundle.hooks.js";
import { SerialAndBatchBundleForm } from "../forms/serial-and-batch-bundle-form.js";
import type { SerialAndBatchBundle } from "../types/serial-and-batch-bundle.js";
import { Button } from "@/components/ui/button";

export function SerialAndBatchBundleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSerialAndBatchBundle(params.id);
  const updateMutation = useUpdateSerialAndBatchBundle();

  const handleSubmit = (formData: Partial<SerialAndBatchBundle>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/serial-and-batch-bundle") },
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
      <Button variant="ghost" onClick={() => router.push("/serial-and-batch-bundle")}>← Back</Button>
      <SerialAndBatchBundleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}