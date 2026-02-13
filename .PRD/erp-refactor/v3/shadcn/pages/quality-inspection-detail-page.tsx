"use client";

// Detail page for Quality Inspection
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityInspection, useUpdateQualityInspection } from "../hooks/quality-inspection.hooks.js";
import { QualityInspectionForm } from "../forms/quality-inspection-form.js";
import type { QualityInspection } from "../types/quality-inspection.js";
import { Button } from "@/components/ui/button";

export function QualityInspectionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityInspection(params.id);
  const updateMutation = useUpdateQualityInspection();

  const handleSubmit = (formData: Partial<QualityInspection>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-inspection") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-inspection")}>← Back</Button>
      <QualityInspectionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}