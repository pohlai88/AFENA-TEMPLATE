"use client";

// Detail page for Sales Invoice Payment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesInvoicePayment, useUpdateSalesInvoicePayment } from "../hooks/sales-invoice-payment.hooks.js";
import { SalesInvoicePaymentForm } from "../forms/sales-invoice-payment-form.js";
import type { SalesInvoicePayment } from "../types/sales-invoice-payment.js";
import { Button } from "@/components/ui/button";

export function SalesInvoicePaymentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesInvoicePayment(params.id);
  const updateMutation = useUpdateSalesInvoicePayment();

  const handleSubmit = (formData: Partial<SalesInvoicePayment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-invoice-payment") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-invoice-payment")}>← Back</Button>
      <SalesInvoicePaymentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}