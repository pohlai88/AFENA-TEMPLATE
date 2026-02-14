"use client";

// Detail page for Quality Review Objective
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityReviewObjective, useUpdateQualityReviewObjective } from "../hooks/quality-review-objective.hooks.js";
import { QualityReviewObjectiveForm } from "../forms/quality-review-objective-form.js";
import type { QualityReviewObjective } from "../types/quality-review-objective.js";
import { Button } from "@/components/ui/button";

export function QualityReviewObjectiveDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityReviewObjective(params.id);
  const updateMutation = useUpdateQualityReviewObjective();

  const handleSubmit = (formData: Partial<QualityReviewObjective>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-review-objective") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-review-objective")}>← Back</Button>
      <QualityReviewObjectiveForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}