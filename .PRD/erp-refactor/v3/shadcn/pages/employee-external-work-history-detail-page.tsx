"use client";

// Detail page for Employee External Work History
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmployeeExternalWorkHistory, useUpdateEmployeeExternalWorkHistory } from "../hooks/employee-external-work-history.hooks.js";
import { EmployeeExternalWorkHistoryForm } from "../forms/employee-external-work-history-form.js";
import type { EmployeeExternalWorkHistory } from "../types/employee-external-work-history.js";
import { Button } from "@/components/ui/button";

export function EmployeeExternalWorkHistoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmployeeExternalWorkHistory(params.id);
  const updateMutation = useUpdateEmployeeExternalWorkHistory();

  const handleSubmit = (formData: Partial<EmployeeExternalWorkHistory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/employee-external-work-history") },
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
      <Button variant="ghost" onClick={() => router.push("/employee-external-work-history")}>← Back</Button>
      <EmployeeExternalWorkHistoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}