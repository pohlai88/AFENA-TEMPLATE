"use client";

// Detail page for Supplier Scorecard Scoring Standing
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardScoringStanding, useUpdateSupplierScorecardScoringStanding } from "../hooks/supplier-scorecard-scoring-standing.hooks.js";
import { SupplierScorecardScoringStandingForm } from "../forms/supplier-scorecard-scoring-standing-form.js";
import type { SupplierScorecardScoringStanding } from "../types/supplier-scorecard-scoring-standing.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardScoringStandingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardScoringStanding(params.id);
  const updateMutation = useUpdateSupplierScorecardScoringStanding();

  const handleSubmit = (formData: Partial<SupplierScorecardScoringStanding>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-scoring-standing") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-scoring-standing")}>← Back</Button>
      <SupplierScorecardScoringStandingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}