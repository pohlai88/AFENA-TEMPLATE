"use client";

// Detail page for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMonthlyDistributionPercentage, useUpdateMonthlyDistributionPercentage } from "../hooks/monthly-distribution-percentage.hooks.js";
import { MonthlyDistributionPercentageForm } from "../forms/monthly-distribution-percentage-form.js";
import type { MonthlyDistributionPercentage } from "../types/monthly-distribution-percentage.js";
import { Button } from "@/components/ui/button";

export function MonthlyDistributionPercentageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMonthlyDistributionPercentage(params.id);
  const updateMutation = useUpdateMonthlyDistributionPercentage();

  const handleSubmit = (formData: Partial<MonthlyDistributionPercentage>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/monthly-distribution-percentage") },
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
      <Button variant="ghost" onClick={() => router.push("/monthly-distribution-percentage")}>← Back</Button>
      <MonthlyDistributionPercentageForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}