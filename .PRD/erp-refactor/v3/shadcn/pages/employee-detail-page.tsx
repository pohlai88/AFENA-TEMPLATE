"use client";

// Detail page for Employee
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useEmployee, useUpdateEmployee } from "../hooks/employee.hooks.js";
import { EmployeeForm } from "../forms/employee-form.js";
import type { Employee } from "../types/employee.js";
import { Button } from "@/components/ui/button";

export function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useEmployee(params.id);
  const updateMutation = useUpdateEmployee();

  const handleSubmit = (formData: Partial<Employee>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/employee") },
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
      <Button variant="ghost" onClick={() => router.push("/employee")}>← Back</Button>
      <EmployeeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}