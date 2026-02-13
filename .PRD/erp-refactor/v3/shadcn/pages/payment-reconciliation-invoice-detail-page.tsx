"use client";

// Detail page for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentReconciliationInvoice, useUpdatePaymentReconciliationInvoice } from "../hooks/payment-reconciliation-invoice.hooks.js";
import { PaymentReconciliationInvoiceForm } from "../forms/payment-reconciliation-invoice-form.js";
import type { PaymentReconciliationInvoice } from "../types/payment-reconciliation-invoice.js";
import { Button } from "@/components/ui/button";

export function PaymentReconciliationInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentReconciliationInvoice(params.id);
  const updateMutation = useUpdatePaymentReconciliationInvoice();

  const handleSubmit = (formData: Partial<PaymentReconciliationInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-reconciliation-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-reconciliation-invoice")}>← Back</Button>
      <PaymentReconciliationInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}