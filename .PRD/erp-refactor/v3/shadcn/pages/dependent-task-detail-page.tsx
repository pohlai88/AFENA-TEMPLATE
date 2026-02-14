"use client";

// Detail page for Dependent Task
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDependentTask, useUpdateDependentTask } from "../hooks/dependent-task.hooks.js";
import { DependentTaskForm } from "../forms/dependent-task-form.js";
import type { DependentTask } from "../types/dependent-task.js";
import { Button } from "@/components/ui/button";

export function DependentTaskDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDependentTask(params.id);
  const updateMutation = useUpdateDependentTask();

  const handleSubmit = (formData: Partial<DependentTask>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/dependent-task") },
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
      <Button variant="ghost" onClick={() => router.push("/dependent-task")}>← Back</Button>
      <DependentTaskForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}