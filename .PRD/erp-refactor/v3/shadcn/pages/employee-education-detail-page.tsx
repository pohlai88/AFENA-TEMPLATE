"use client";

// Detail page for Employee Education
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmployeeEducation, useUpdateEmployeeEducation } from "../hooks/employee-education.hooks.js";
import { EmployeeEducationForm } from "../forms/employee-education-form.js";
import type { EmployeeEducation } from "../types/employee-education.js";
import { Button } from "@/components/ui/button";

export function EmployeeEducationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmployeeEducation(params.id);
  const updateMutation = useUpdateEmployeeEducation();

  const handleSubmit = (formData: Partial<EmployeeEducation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/employee-education") },
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
      <Button variant="ghost" onClick={() => router.push("/employee-education")}>← Back</Button>
      <EmployeeEducationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}