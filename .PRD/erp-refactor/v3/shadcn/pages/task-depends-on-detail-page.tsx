"use client";

// Detail page for Task Depends On
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaskDependsOn, useUpdateTaskDependsOn } from "../hooks/task-depends-on.hooks.js";
import { TaskDependsOnForm } from "../forms/task-depends-on-form.js";
import type { TaskDependsOn } from "../types/task-depends-on.js";
import { Button } from "@/components/ui/button";

export function TaskDependsOnDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaskDependsOn(params.id);
  const updateMutation = useUpdateTaskDependsOn();

  const handleSubmit = (formData: Partial<TaskDependsOn>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/task-depends-on") },
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
      <Button variant="ghost" onClick={() => router.push("/task-depends-on")}>← Back</Button>
      <TaskDependsOnForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}