"use client";

// Detail page for Quality Review
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityReview, useUpdateQualityReview } from "../hooks/quality-review.hooks.js";
import { QualityReviewForm } from "../forms/quality-review-form.js";
import type { QualityReview } from "../types/quality-review.js";
import { Button } from "@/components/ui/button";

export function QualityReviewDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityReview(params.id);
  const updateMutation = useUpdateQualityReview();

  const handleSubmit = (formData: Partial<QualityReview>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-review") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-review")}>← Back</Button>
      <QualityReviewForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}