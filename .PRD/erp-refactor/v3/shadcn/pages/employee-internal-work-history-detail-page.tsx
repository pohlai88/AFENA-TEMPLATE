"use client";

// Detail page for Employee Internal Work History
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmployeeInternalWorkHistory, useUpdateEmployeeInternalWorkHistory } from "../hooks/employee-internal-work-history.hooks.js";
import { EmployeeInternalWorkHistoryForm } from "../forms/employee-internal-work-history-form.js";
import type { EmployeeInternalWorkHistory } from "../types/employee-internal-work-history.js";
import { Button } from "@/components/ui/button";

export function EmployeeInternalWorkHistoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmployeeInternalWorkHistory(params.id);
  const updateMutation = useUpdateEmployeeInternalWorkHistory();

  const handleSubmit = (formData: Partial<EmployeeInternalWorkHistory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/employee-internal-work-history") },
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
      <Button variant="ghost" onClick={() => router.push("/employee-internal-work-history")}>← Back</Button>
      <EmployeeInternalWorkHistoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}