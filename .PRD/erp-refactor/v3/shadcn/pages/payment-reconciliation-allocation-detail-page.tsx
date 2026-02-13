"use client";

// Detail page for Payment Reconciliation Allocation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentReconciliationAllocation, useUpdatePaymentReconciliationAllocation } from "../hooks/payment-reconciliation-allocation.hooks.js";
import { PaymentReconciliationAllocationForm } from "../forms/payment-reconciliation-allocation-form.js";
import type { PaymentReconciliationAllocation } from "../types/payment-reconciliation-allocation.js";
import { Button } from "@/components/ui/button";

export function PaymentReconciliationAllocationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentReconciliationAllocation(params.id);
  const updateMutation = useUpdatePaymentReconciliationAllocation();

  const handleSubmit = (formData: Partial<PaymentReconciliationAllocation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-reconciliation-allocation") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-reconciliation-allocation")}>← Back</Button>
      <PaymentReconciliationAllocationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}