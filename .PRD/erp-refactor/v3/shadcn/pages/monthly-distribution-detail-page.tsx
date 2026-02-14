"use client";

// Detail page for Monthly Distribution
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMonthlyDistribution, useUpdateMonthlyDistribution } from "../hooks/monthly-distribution.hooks.js";
import { MonthlyDistributionForm } from "../forms/monthly-distribution-form.js";
import type { MonthlyDistribution } from "../types/monthly-distribution.js";
import { Button } from "@/components/ui/button";

export function MonthlyDistributionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMonthlyDistribution(params.id);
  const updateMutation = useUpdateMonthlyDistribution();

  const handleSubmit = (formData: Partial<MonthlyDistribution>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/monthly-distribution") },
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
      <Button variant="ghost" onClick={() => router.push("/monthly-distribution")}>← Back</Button>
      <MonthlyDistributionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}