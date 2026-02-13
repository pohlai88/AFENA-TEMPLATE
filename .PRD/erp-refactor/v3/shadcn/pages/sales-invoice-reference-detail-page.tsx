"use client";

// Detail page for Sales Invoice Reference
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesInvoiceReference, useUpdateSalesInvoiceReference } from "../hooks/sales-invoice-reference.hooks.js";
import { SalesInvoiceReferenceForm } from "../forms/sales-invoice-reference-form.js";
import type { SalesInvoiceReference } from "../types/sales-invoice-reference.js";
import { Button } from "@/components/ui/button";

export function SalesInvoiceReferenceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesInvoiceReference(params.id);
  const updateMutation = useUpdateSalesInvoiceReference();

  const handleSubmit = (formData: Partial<SalesInvoiceReference>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-invoice-reference") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-invoice-reference")}>← Back</Button>
      <SalesInvoiceReferenceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}