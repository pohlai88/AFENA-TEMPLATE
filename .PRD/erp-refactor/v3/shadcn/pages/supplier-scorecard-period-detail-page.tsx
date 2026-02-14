"use client";

// Detail page for Supplier Scorecard Period
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardPeriod, useUpdateSupplierScorecardPeriod } from "../hooks/supplier-scorecard-period.hooks.js";
import { SupplierScorecardPeriodForm } from "../forms/supplier-scorecard-period-form.js";
import type { SupplierScorecardPeriod } from "../types/supplier-scorecard-period.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardPeriodDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardPeriod(params.id);
  const updateMutation = useUpdateSupplierScorecardPeriod();

  const handleSubmit = (formData: Partial<SupplierScorecardPeriod>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-period") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-period")}>← Back</Button>
      <SupplierScorecardPeriodForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}