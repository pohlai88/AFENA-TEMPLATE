"use client";

// Detail page for Quality Feedback
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityFeedback, useUpdateQualityFeedback } from "../hooks/quality-feedback.hooks.js";
import { QualityFeedbackForm } from "../forms/quality-feedback-form.js";
import type { QualityFeedback } from "../types/quality-feedback.js";
import { Button } from "@/components/ui/button";

export function QualityFeedbackDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityFeedback(params.id);
  const updateMutation = useUpdateQualityFeedback();

  const handleSubmit = (formData: Partial<QualityFeedback>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-feedback") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-feedback")}>← Back</Button>
      <QualityFeedbackForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}