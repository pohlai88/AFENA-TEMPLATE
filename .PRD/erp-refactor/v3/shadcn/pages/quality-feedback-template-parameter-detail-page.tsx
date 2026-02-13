"use client";

// Detail page for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityFeedbackTemplateParameter, useUpdateQualityFeedbackTemplateParameter } from "../hooks/quality-feedback-template-parameter.hooks.js";
import { QualityFeedbackTemplateParameterForm } from "../forms/quality-feedback-template-parameter-form.js";
import type { QualityFeedbackTemplateParameter } from "../types/quality-feedback-template-parameter.js";
import { Button } from "@/components/ui/button";

export function QualityFeedbackTemplateParameterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityFeedbackTemplateParameter(params.id);
  const updateMutation = useUpdateQualityFeedbackTemplateParameter();

  const handleSubmit = (formData: Partial<QualityFeedbackTemplateParameter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-feedback-template-parameter") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-feedback-template-parameter")}>← Back</Button>
      <QualityFeedbackTemplateParameterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}