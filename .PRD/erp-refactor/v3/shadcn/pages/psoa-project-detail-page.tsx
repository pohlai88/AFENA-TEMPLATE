"use client";

// Detail page for PSOA Project
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePsoaProject, useUpdatePsoaProject } from "../hooks/psoa-project.hooks.js";
import { PsoaProjectForm } from "../forms/psoa-project-form.js";
import type { PsoaProject } from "../types/psoa-project.js";
import { Button } from "@/components/ui/button";

export function PsoaProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePsoaProject(params.id);
  const updateMutation = useUpdatePsoaProject();

  const handleSubmit = (formData: Partial<PsoaProject>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/psoa-project") },
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
      <Button variant="ghost" onClick={() => router.push("/psoa-project")}>← Back</Button>
      <PsoaProjectForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}