"use client";

// Detail page for BOM Update Batch
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomUpdateBatch, useUpdateBomUpdateBatch } from "../hooks/bom-update-batch.hooks.js";
import { BomUpdateBatchForm } from "../forms/bom-update-batch-form.js";
import type { BomUpdateBatch } from "../types/bom-update-batch.js";
import { Button } from "@/components/ui/button";

export function BomUpdateBatchDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomUpdateBatch(params.id);
  const updateMutation = useUpdateBomUpdateBatch();

  const handleSubmit = (formData: Partial<BomUpdateBatch>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-update-batch") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-update-batch")}>← Back</Button>
      <BomUpdateBatchForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}