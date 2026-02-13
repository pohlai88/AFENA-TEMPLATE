"use client";

// Detail page for Budget Distribution
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBudgetDistribution, useUpdateBudgetDistribution } from "../hooks/budget-distribution.hooks.js";
import { BudgetDistributionForm } from "../forms/budget-distribution-form.js";
import type { BudgetDistribution } from "../types/budget-distribution.js";
import { Button } from "@/components/ui/button";

export function BudgetDistributionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBudgetDistribution(params.id);
  const updateMutation = useUpdateBudgetDistribution();

  const handleSubmit = (formData: Partial<BudgetDistribution>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/budget-distribution") },
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
      <Button variant="ghost" onClick={() => router.push("/budget-distribution")}>← Back</Button>
      <BudgetDistributionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}