"use client";

// Detail page for Fiscal Year
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useFiscalYear, useUpdateFiscalYear } from "../hooks/fiscal-year.hooks.js";
import { FiscalYearForm } from "../forms/fiscal-year-form.js";
import type { FiscalYear } from "../types/fiscal-year.js";
import { Button } from "@/components/ui/button";

export function FiscalYearDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useFiscalYear(params.id);
  const updateMutation = useUpdateFiscalYear();

  const handleSubmit = (formData: Partial<FiscalYear>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/fiscal-year") },
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
      <Button variant="ghost" onClick={() => router.push("/fiscal-year")}>← Back</Button>
      <FiscalYearForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}