"use client";

// Detail page for Process Payment Reconciliation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessPaymentReconciliation, useUpdateProcessPaymentReconciliation } from "../hooks/process-payment-reconciliation.hooks.js";
import { ProcessPaymentReconciliationForm } from "../forms/process-payment-reconciliation-form.js";
import type { ProcessPaymentReconciliation } from "../types/process-payment-reconciliation.js";
import { Button } from "@/components/ui/button";

export function ProcessPaymentReconciliationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessPaymentReconciliation(params.id);
  const updateMutation = useUpdateProcessPaymentReconciliation();

  const handleSubmit = (formData: Partial<ProcessPaymentReconciliation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-payment-reconciliation") },
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
      <Button variant="ghost" onClick={() => router.push("/process-payment-reconciliation")}>← Back</Button>
      <ProcessPaymentReconciliationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}