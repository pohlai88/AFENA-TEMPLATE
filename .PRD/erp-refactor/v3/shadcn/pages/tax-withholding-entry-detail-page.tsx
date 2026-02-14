"use client";

// Detail page for Tax Withholding Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxWithholdingEntry, useUpdateTaxWithholdingEntry } from "../hooks/tax-withholding-entry.hooks.js";
import { TaxWithholdingEntryForm } from "../forms/tax-withholding-entry-form.js";
import type { TaxWithholdingEntry } from "../types/tax-withholding-entry.js";
import { Button } from "@/components/ui/button";

export function TaxWithholdingEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxWithholdingEntry(params.id);
  const updateMutation = useUpdateTaxWithholdingEntry();

  const handleSubmit = (formData: Partial<TaxWithholdingEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-withholding-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-withholding-entry")}>← Back</Button>
      <TaxWithholdingEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}