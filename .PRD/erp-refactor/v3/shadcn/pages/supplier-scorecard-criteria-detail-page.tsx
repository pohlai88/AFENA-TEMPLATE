"use client";

// Detail page for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardCriteria, useUpdateSupplierScorecardCriteria } from "../hooks/supplier-scorecard-criteria.hooks.js";
import { SupplierScorecardCriteriaForm } from "../forms/supplier-scorecard-criteria-form.js";
import type { SupplierScorecardCriteria } from "../types/supplier-scorecard-criteria.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardCriteriaDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardCriteria(params.id);
  const updateMutation = useUpdateSupplierScorecardCriteria();

  const handleSubmit = (formData: Partial<SupplierScorecardCriteria>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-criteria") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-criteria")}>← Back</Button>
      <SupplierScorecardCriteriaForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}