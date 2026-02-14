"use client";

// Detail page for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessPaymentReconciliationLog, useUpdateProcessPaymentReconciliationLog } from "../hooks/process-payment-reconciliation-log.hooks.js";
import { ProcessPaymentReconciliationLogForm } from "../forms/process-payment-reconciliation-log-form.js";
import type { ProcessPaymentReconciliationLog } from "../types/process-payment-reconciliation-log.js";
import { Button } from "@/components/ui/button";

export function ProcessPaymentReconciliationLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessPaymentReconciliationLog(params.id);
  const updateMutation = useUpdateProcessPaymentReconciliationLog();

  const handleSubmit = (formData: Partial<ProcessPaymentReconciliationLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-payment-reconciliation-log") },
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
      <Button variant="ghost" onClick={() => router.push("/process-payment-reconciliation-log")}>← Back</Button>
      <ProcessPaymentReconciliationLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}