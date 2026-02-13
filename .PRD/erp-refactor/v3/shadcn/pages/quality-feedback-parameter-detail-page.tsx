"use client";

// Detail page for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityFeedbackParameter, useUpdateQualityFeedbackParameter } from "../hooks/quality-feedback-parameter.hooks.js";
import { QualityFeedbackParameterForm } from "../forms/quality-feedback-parameter-form.js";
import type { QualityFeedbackParameter } from "../types/quality-feedback-parameter.js";
import { Button } from "@/components/ui/button";

export function QualityFeedbackParameterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityFeedbackParameter(params.id);
  const updateMutation = useUpdateQualityFeedbackParameter();

  const handleSubmit = (formData: Partial<QualityFeedbackParameter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-feedback-parameter") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-feedback-parameter")}>← Back</Button>
      <QualityFeedbackParameterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}