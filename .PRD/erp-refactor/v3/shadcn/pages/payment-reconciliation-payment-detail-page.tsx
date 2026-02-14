"use client";

// Detail page for Payment Reconciliation Payment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentReconciliationPayment, useUpdatePaymentReconciliationPayment } from "../hooks/payment-reconciliation-payment.hooks.js";
import { PaymentReconciliationPaymentForm } from "../forms/payment-reconciliation-payment-form.js";
import type { PaymentReconciliationPayment } from "../types/payment-reconciliation-payment.js";
import { Button } from "@/components/ui/button";

export function PaymentReconciliationPaymentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentReconciliationPayment(params.id);
  const updateMutation = useUpdatePaymentReconciliationPayment();

  const handleSubmit = (formData: Partial<PaymentReconciliationPayment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-reconciliation-payment") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-reconciliation-payment")}>← Back</Button>
      <PaymentReconciliationPaymentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}