"use client";

// Detail page for Financial Report Row
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useFinancialReportRow, useUpdateFinancialReportRow } from "../hooks/financial-report-row.hooks.js";
import { FinancialReportRowForm } from "../forms/financial-report-row-form.js";
import type { FinancialReportRow } from "../types/financial-report-row.js";
import { Button } from "@/components/ui/button";

export function FinancialReportRowDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useFinancialReportRow(params.id);
  const updateMutation = useUpdateFinancialReportRow();

  const handleSubmit = (formData: Partial<FinancialReportRow>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/financial-report-row") },
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
      <Button variant="ghost" onClick={() => router.push("/financial-report-row")}>← Back</Button>
      <FinancialReportRowForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}