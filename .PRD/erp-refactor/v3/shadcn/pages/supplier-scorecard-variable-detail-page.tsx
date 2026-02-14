"use client";

// Detail page for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardVariable, useUpdateSupplierScorecardVariable } from "../hooks/supplier-scorecard-variable.hooks.js";
import { SupplierScorecardVariableForm } from "../forms/supplier-scorecard-variable-form.js";
import type { SupplierScorecardVariable } from "../types/supplier-scorecard-variable.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardVariableDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardVariable(params.id);
  const updateMutation = useUpdateSupplierScorecardVariable();

  const handleSubmit = (formData: Partial<SupplierScorecardVariable>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-variable") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-variable")}>← Back</Button>
      <SupplierScorecardVariableForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}