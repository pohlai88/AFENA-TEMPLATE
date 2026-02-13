"use client";

// Detail page for Quality Inspection Reading
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityInspectionReading, useUpdateQualityInspectionReading } from "../hooks/quality-inspection-reading.hooks.js";
import { QualityInspectionReadingForm } from "../forms/quality-inspection-reading-form.js";
import type { QualityInspectionReading } from "../types/quality-inspection-reading.js";
import { Button } from "@/components/ui/button";

export function QualityInspectionReadingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityInspectionReading(params.id);
  const updateMutation = useUpdateQualityInspectionReading();

  const handleSubmit = (formData: Partial<QualityInspectionReading>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-inspection-reading") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-inspection-reading")}>← Back</Button>
      <QualityInspectionReadingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}