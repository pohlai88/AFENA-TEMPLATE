"use client";

// Detail page for Sales Invoice Advance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesInvoiceAdvance, useUpdateSalesInvoiceAdvance } from "../hooks/sales-invoice-advance.hooks.js";
import { SalesInvoiceAdvanceForm } from "../forms/sales-invoice-advance-form.js";
import type { SalesInvoiceAdvance } from "../types/sales-invoice-advance.js";
import { Button } from "@/components/ui/button";

export function SalesInvoiceAdvanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesInvoiceAdvance(params.id);
  const updateMutation = useUpdateSalesInvoiceAdvance();

  const handleSubmit = (formData: Partial<SalesInvoiceAdvance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-invoice-advance") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-invoice-advance")}>← Back</Button>
      <SalesInvoiceAdvanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}