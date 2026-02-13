"use client";

// Detail page for Issue Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useIssueType, useUpdateIssueType } from "../hooks/issue-type.hooks.js";
import { IssueTypeForm } from "../forms/issue-type-form.js";
import type { IssueType } from "../types/issue-type.js";
import { Button } from "@/components/ui/button";

export function IssueTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useIssueType(params.id);
  const updateMutation = useUpdateIssueType();

  const handleSubmit = (formData: Partial<IssueType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/issue-type") },
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
      <Button variant="ghost" onClick={() => router.push("/issue-type")}>← Back</Button>
      <IssueTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}