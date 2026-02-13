"use client";

// Detail page for Quality Feedback Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityFeedbackTemplate, useUpdateQualityFeedbackTemplate } from "../hooks/quality-feedback-template.hooks.js";
import { QualityFeedbackTemplateForm } from "../forms/quality-feedback-template-form.js";
import type { QualityFeedbackTemplate } from "../types/quality-feedback-template.js";
import { Button } from "@/components/ui/button";

export function QualityFeedbackTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityFeedbackTemplate(params.id);
  const updateMutation = useUpdateQualityFeedbackTemplate();

  const handleSubmit = (formData: Partial<QualityFeedbackTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-feedback-template") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-feedback-template")}>← Back</Button>
      <QualityFeedbackTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}