"use client";

// Detail page for Quality Goal Objective
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityGoalObjective, useUpdateQualityGoalObjective } from "../hooks/quality-goal-objective.hooks.js";
import { QualityGoalObjectiveForm } from "../forms/quality-goal-objective-form.js";
import type { QualityGoalObjective } from "../types/quality-goal-objective.js";
import { Button } from "@/components/ui/button";

export function QualityGoalObjectiveDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityGoalObjective(params.id);
  const updateMutation = useUpdateQualityGoalObjective();

  const handleSubmit = (formData: Partial<QualityGoalObjective>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-goal-objective") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-goal-objective")}>← Back</Button>
      <QualityGoalObjectiveForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}