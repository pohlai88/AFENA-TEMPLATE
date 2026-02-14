"use client";

// Detail page for Fiscal Year Company
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useFiscalYearCompany, useUpdateFiscalYearCompany } from "../hooks/fiscal-year-company.hooks.js";
import { FiscalYearCompanyForm } from "../forms/fiscal-year-company-form.js";
import type { FiscalYearCompany } from "../types/fiscal-year-company.js";
import { Button } from "@/components/ui/button";

export function FiscalYearCompanyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useFiscalYearCompany(params.id);
  const updateMutation = useUpdateFiscalYearCompany();

  const handleSubmit = (formData: Partial<FiscalYearCompany>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/fiscal-year-company") },
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
      <Button variant="ghost" onClick={() => router.push("/fiscal-year-company")}>← Back</Button>
      <FiscalYearCompanyForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}