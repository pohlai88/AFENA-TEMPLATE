"use client";

// Detail page for Project Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProjectTemplate, useUpdateProjectTemplate } from "../hooks/project-template.hooks.js";
import { ProjectTemplateForm } from "../forms/project-template-form.js";
import type { ProjectTemplate } from "../types/project-template.js";
import { Button } from "@/components/ui/button";

export function ProjectTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProjectTemplate(params.id);
  const updateMutation = useUpdateProjectTemplate();

  const handleSubmit = (formData: Partial<ProjectTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/project-template") },
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
      <Button variant="ghost" onClick={() => router.push("/project-template")}>← Back</Button>
      <ProjectTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}