"use client";

// Detail page for Department
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDepartment, useUpdateDepartment } from "../hooks/department.hooks.js";
import { DepartmentForm } from "../forms/department-form.js";
import type { Department } from "../types/department.js";
import { Button } from "@/components/ui/button";

export function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDepartment(params.id);
  const updateMutation = useUpdateDepartment();

  const handleSubmit = (formData: Partial<Department>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/department") },
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
      <Button variant="ghost" onClick={() => router.push("/department")}>← Back</Button>
      <DepartmentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}