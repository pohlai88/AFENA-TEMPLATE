"use client";

// Detail page for Project Template Task
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProjectTemplateTask, useUpdateProjectTemplateTask } from "../hooks/project-template-task.hooks.js";
import { ProjectTemplateTaskForm } from "../forms/project-template-task-form.js";
import type { ProjectTemplateTask } from "../types/project-template-task.js";
import { Button } from "@/components/ui/button";

export function ProjectTemplateTaskDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProjectTemplateTask(params.id);
  const updateMutation = useUpdateProjectTemplateTask();

  const handleSubmit = (formData: Partial<ProjectTemplateTask>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/project-template-task") },
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
      <Button variant="ghost" onClick={() => router.push("/project-template-task")}>← Back</Button>
      <ProjectTemplateTaskForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}