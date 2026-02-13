"use client";

// Detail page for Overdue Payment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOverduePayment, useUpdateOverduePayment } from "../hooks/overdue-payment.hooks.js";
import { OverduePaymentForm } from "../forms/overdue-payment-form.js";
import type { OverduePayment } from "../types/overdue-payment.js";
import { Button } from "@/components/ui/button";

export function OverduePaymentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOverduePayment(params.id);
  const updateMutation = useUpdateOverduePayment();

  const handleSubmit = (formData: Partial<OverduePayment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/overdue-payment") },
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
      <Button variant="ghost" onClick={() => router.push("/overdue-payment")}>← Back</Button>
      <OverduePaymentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}