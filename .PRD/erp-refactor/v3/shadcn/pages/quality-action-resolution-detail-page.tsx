"use client";

// Detail page for Quality Action Resolution
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityActionResolution, useUpdateQualityActionResolution } from "../hooks/quality-action-resolution.hooks.js";
import { QualityActionResolutionForm } from "../forms/quality-action-resolution-form.js";
import type { QualityActionResolution } from "../types/quality-action-resolution.js";
import { Button } from "@/components/ui/button";

export function QualityActionResolutionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityActionResolution(params.id);
  const updateMutation = useUpdateQualityActionResolution();

  const handleSubmit = (formData: Partial<QualityActionResolution>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-action-resolution") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-action-resolution")}>← Back</Button>
      <QualityActionResolutionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}