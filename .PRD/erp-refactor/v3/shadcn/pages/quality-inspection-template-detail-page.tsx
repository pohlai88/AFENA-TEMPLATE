"use client";

// Detail page for Quality Inspection Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityInspectionTemplate, useUpdateQualityInspectionTemplate } from "../hooks/quality-inspection-template.hooks.js";
import { QualityInspectionTemplateForm } from "../forms/quality-inspection-template-form.js";
import type { QualityInspectionTemplate } from "../types/quality-inspection-template.js";
import { Button } from "@/components/ui/button";

export function QualityInspectionTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityInspectionTemplate(params.id);
  const updateMutation = useUpdateQualityInspectionTemplate();

  const handleSubmit = (formData: Partial<QualityInspectionTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-inspection-template") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-inspection-template")}>← Back</Button>
      <QualityInspectionTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}