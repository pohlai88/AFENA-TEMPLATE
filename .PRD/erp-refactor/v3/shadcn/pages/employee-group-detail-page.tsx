"use client";

// Detail page for Employee Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmployeeGroup, useUpdateEmployeeGroup } from "../hooks/employee-group.hooks.js";
import { EmployeeGroupForm } from "../forms/employee-group-form.js";
import type { EmployeeGroup } from "../types/employee-group.js";
import { Button } from "@/components/ui/button";

export function EmployeeGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmployeeGroup(params.id);
  const updateMutation = useUpdateEmployeeGroup();

  const handleSubmit = (formData: Partial<EmployeeGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/employee-group") },
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
      <Button variant="ghost" onClick={() => router.push("/employee-group")}>← Back</Button>
      <EmployeeGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}