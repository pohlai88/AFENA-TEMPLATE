"use client";

// Detail page for Branch
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBranch, useUpdateBranch } from "../hooks/branch.hooks.js";
import { BranchForm } from "../forms/branch-form.js";
import type { Branch } from "../types/branch.js";
import { Button } from "@/components/ui/button";

export function BranchDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBranch(params.id);
  const updateMutation = useUpdateBranch();

  const handleSubmit = (formData: Partial<Branch>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/branch") },
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
      <Button variant="ghost" onClick={() => router.push("/branch")}>← Back</Button>
      <BranchForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}