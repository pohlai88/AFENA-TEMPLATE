"use client";

// Detail page for Issue Priority
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useIssuePriority, useUpdateIssuePriority } from "../hooks/issue-priority.hooks.js";
import { IssuePriorityForm } from "../forms/issue-priority-form.js";
import type { IssuePriority } from "../types/issue-priority.js";
import { Button } from "@/components/ui/button";

export function IssuePriorityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useIssuePriority(params.id);
  const updateMutation = useUpdateIssuePriority();

  const handleSubmit = (formData: Partial<IssuePriority>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/issue-priority") },
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
      <Button variant="ghost" onClick={() => router.push("/issue-priority")}>← Back</Button>
      <IssuePriorityForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}