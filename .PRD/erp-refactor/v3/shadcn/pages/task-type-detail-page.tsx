"use client";

// Detail page for Task Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaskType, useUpdateTaskType } from "../hooks/task-type.hooks.js";
import { TaskTypeForm } from "../forms/task-type-form.js";
import type { TaskType } from "../types/task-type.js";
import { Button } from "@/components/ui/button";

export function TaskTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaskType(params.id);
  const updateMutation = useUpdateTaskType();

  const handleSubmit = (formData: Partial<TaskType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/task-type") },
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
      <Button variant="ghost" onClick={() => router.push("/task-type")}>← Back</Button>
      <TaskTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}