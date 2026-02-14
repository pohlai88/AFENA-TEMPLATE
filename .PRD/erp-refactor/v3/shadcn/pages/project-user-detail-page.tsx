"use client";

// Detail page for Project User
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProjectUser, useUpdateProjectUser } from "../hooks/project-user.hooks.js";
import { ProjectUserForm } from "../forms/project-user-form.js";
import type { ProjectUser } from "../types/project-user.js";
import { Button } from "@/components/ui/button";

export function ProjectUserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProjectUser(params.id);
  const updateMutation = useUpdateProjectUser();

  const handleSubmit = (formData: Partial<ProjectUser>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/project-user") },
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
      <Button variant="ghost" onClick={() => router.push("/project-user")}>← Back</Button>
      <ProjectUserForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}