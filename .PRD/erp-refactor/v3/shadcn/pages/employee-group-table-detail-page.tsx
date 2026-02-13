"use client";

// Detail page for Employee Group Table
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmployeeGroupTable, useUpdateEmployeeGroupTable } from "../hooks/employee-group-table.hooks.js";
import { EmployeeGroupTableForm } from "../forms/employee-group-table-form.js";
import type { EmployeeGroupTable } from "../types/employee-group-table.js";
import { Button } from "@/components/ui/button";

export function EmployeeGroupTableDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmployeeGroupTable(params.id);
  const updateMutation = useUpdateEmployeeGroupTable();

  const handleSubmit = (formData: Partial<EmployeeGroupTable>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/employee-group-table") },
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
      <Button variant="ghost" onClick={() => router.push("/employee-group-table")}>← Back</Button>
      <EmployeeGroupTableForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}