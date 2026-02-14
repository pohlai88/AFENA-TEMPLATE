"use client";

// Detail page for Financial Report Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useFinancialReportTemplate, useUpdateFinancialReportTemplate } from "../hooks/financial-report-template.hooks.js";
import { FinancialReportTemplateForm } from "../forms/financial-report-template-form.js";
import type { FinancialReportTemplate } from "../types/financial-report-template.js";
import { Button } from "@/components/ui/button";

export function FinancialReportTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useFinancialReportTemplate(params.id);
  const updateMutation = useUpdateFinancialReportTemplate();

  const handleSubmit = (formData: Partial<FinancialReportTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/financial-report-template") },
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
      <Button variant="ghost" onClick={() => router.push("/financial-report-template")}>← Back</Button>
      <FinancialReportTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}