"use client";

// Detail page for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardScoringVariable, useUpdateSupplierScorecardScoringVariable } from "../hooks/supplier-scorecard-scoring-variable.hooks.js";
import { SupplierScorecardScoringVariableForm } from "../forms/supplier-scorecard-scoring-variable-form.js";
import type { SupplierScorecardScoringVariable } from "../types/supplier-scorecard-scoring-variable.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardScoringVariableDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardScoringVariable(params.id);
  const updateMutation = useUpdateSupplierScorecardScoringVariable();

  const handleSubmit = (formData: Partial<SupplierScorecardScoringVariable>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-scoring-variable") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-scoring-variable")}>← Back</Button>
      <SupplierScorecardScoringVariableForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}