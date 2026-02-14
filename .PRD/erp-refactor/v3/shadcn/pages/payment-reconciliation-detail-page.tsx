"use client";

// Detail page for Payment Reconciliation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentReconciliation, useUpdatePaymentReconciliation } from "../hooks/payment-reconciliation.hooks.js";
import { PaymentReconciliationForm } from "../forms/payment-reconciliation-form.js";
import type { PaymentReconciliation } from "../types/payment-reconciliation.js";
import { Button } from "@/components/ui/button";

export function PaymentReconciliationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentReconciliation(params.id);
  const updateMutation = useUpdatePaymentReconciliation();

  const handleSubmit = (formData: Partial<PaymentReconciliation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-reconciliation") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-reconciliation")}>← Back</Button>
      <PaymentReconciliationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}