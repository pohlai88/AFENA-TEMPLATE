"use client";

// Detail page for Projects Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProjectsSettings, useUpdateProjectsSettings } from "../hooks/projects-settings.hooks.js";
import { ProjectsSettingsForm } from "../forms/projects-settings-form.js";
import type { ProjectsSettings } from "../types/projects-settings.js";
import { Button } from "@/components/ui/button";

export function ProjectsSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProjectsSettings(params.id);
  const updateMutation = useUpdateProjectsSettings();

  const handleSubmit = (formData: Partial<ProjectsSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/projects-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/projects-settings")}>← Back</Button>
      <ProjectsSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}