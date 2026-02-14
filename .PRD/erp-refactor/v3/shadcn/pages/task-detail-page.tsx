"use client";

// Detail page for Task
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTask, useUpdateTask } from "../hooks/task.hooks.js";
import { TaskForm } from "../forms/task-form.js";
import type { Task } from "../types/task.js";
import { Button } from "@/components/ui/button";

export function TaskDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTask(params.id);
  const updateMutation = useUpdateTask();

  const handleSubmit = (formData: Partial<Task>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/task") },
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
      <Button variant="ghost" onClick={() => router.push("/task")}>← Back</Button>
      <TaskForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}