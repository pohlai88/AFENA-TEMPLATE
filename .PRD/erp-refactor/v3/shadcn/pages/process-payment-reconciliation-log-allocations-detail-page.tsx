"use client";

// Detail page for Process Payment Reconciliation Log Allocations
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessPaymentReconciliationLogAllocations, useUpdateProcessPaymentReconciliationLogAllocations } from "../hooks/process-payment-reconciliation-log-allocations.hooks.js";
import { ProcessPaymentReconciliationLogAllocationsForm } from "../forms/process-payment-reconciliation-log-allocations-form.js";
import type { ProcessPaymentReconciliationLogAllocations } from "../types/process-payment-reconciliation-log-allocations.js";
import { Button } from "@/components/ui/button";

export function ProcessPaymentReconciliationLogAllocationsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessPaymentReconciliationLogAllocations(params.id);
  const updateMutation = useUpdateProcessPaymentReconciliationLogAllocations();

  const handleSubmit = (formData: Partial<ProcessPaymentReconciliationLogAllocations>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-payment-reconciliation-log-allocations") },
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
      <Button variant="ghost" onClick={() => router.push("/process-payment-reconciliation-log-allocations")}>← Back</Button>
      <ProcessPaymentReconciliationLogAllocationsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}