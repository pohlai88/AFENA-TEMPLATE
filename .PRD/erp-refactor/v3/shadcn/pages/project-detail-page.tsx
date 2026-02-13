"use client";

// Detail page for Project
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProject, useUpdateProject } from "../hooks/project.hooks.js";
import { ProjectForm } from "../forms/project-form.js";
import type { Project } from "../types/project.js";
import { Button } from "@/components/ui/button";

export function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProject(params.id);
  const updateMutation = useUpdateProject();

  const handleSubmit = (formData: Partial<Project>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/project") },
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
      <Button variant="ghost" onClick={() => router.push("/project")}>← Back</Button>
      <ProjectForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}