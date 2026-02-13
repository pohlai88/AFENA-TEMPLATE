"use client";

// Detail page for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardScoringCriteria, useUpdateSupplierScorecardScoringCriteria } from "../hooks/supplier-scorecard-scoring-criteria.hooks.js";
import { SupplierScorecardScoringCriteriaForm } from "../forms/supplier-scorecard-scoring-criteria-form.js";
import type { SupplierScorecardScoringCriteria } from "../types/supplier-scorecard-scoring-criteria.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardScoringCriteriaDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardScoringCriteria(params.id);
  const updateMutation = useUpdateSupplierScorecardScoringCriteria();

  const handleSubmit = (formData: Partial<SupplierScorecardScoringCriteria>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-scoring-criteria") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-scoring-criteria")}>← Back</Button>
      <SupplierScorecardScoringCriteriaForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}