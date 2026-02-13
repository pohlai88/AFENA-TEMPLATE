"use client";

// Detail page for Project Update
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProjectUpdate, useUpdateProjectUpdate } from "../hooks/project-update.hooks.js";
import { ProjectUpdateForm } from "../forms/project-update-form.js";
import type { ProjectUpdate } from "../types/project-update.js";
import { Button } from "@/components/ui/button";

export function ProjectUpdateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProjectUpdate(params.id);
  const updateMutation = useUpdateProjectUpdate();

  const handleSubmit = (formData: Partial<ProjectUpdate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/project-update") },
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
      <Button variant="ghost" onClick={() => router.push("/project-update")}>← Back</Button>
      <ProjectUpdateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}