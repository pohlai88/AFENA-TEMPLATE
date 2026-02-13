"use client";

// Detail page for Quality Goal
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityGoal, useUpdateQualityGoal } from "../hooks/quality-goal.hooks.js";
import { QualityGoalForm } from "../forms/quality-goal-form.js";
import type { QualityGoal } from "../types/quality-goal.js";
import { Button } from "@/components/ui/button";

export function QualityGoalDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityGoal(params.id);
  const updateMutation = useUpdateQualityGoal();

  const handleSubmit = (formData: Partial<QualityGoal>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-goal") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-goal")}>← Back</Button>
      <QualityGoalForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}