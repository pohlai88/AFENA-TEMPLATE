"use client";

// Detail page for Project Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProjectType, useUpdateProjectType } from "../hooks/project-type.hooks.js";
import { ProjectTypeForm } from "../forms/project-type-form.js";
import type { ProjectType } from "../types/project-type.js";
import { Button } from "@/components/ui/button";

export function ProjectTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProjectType(params.id);
  const updateMutation = useUpdateProjectType();

  const handleSubmit = (formData: Partial<ProjectType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/project-type") },
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
      <Button variant="ghost" onClick={() => router.push("/project-type")}>← Back</Button>
      <ProjectTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}