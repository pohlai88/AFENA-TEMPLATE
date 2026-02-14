"use client";

// Detail page for Unreconcile Payment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUnreconcilePayment, useUpdateUnreconcilePayment } from "../hooks/unreconcile-payment.hooks.js";
import { UnreconcilePaymentForm } from "../forms/unreconcile-payment-form.js";
import type { UnreconcilePayment } from "../types/unreconcile-payment.js";
import { Button } from "@/components/ui/button";

export function UnreconcilePaymentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUnreconcilePayment(params.id);
  const updateMutation = useUpdateUnreconcilePayment();

  const handleSubmit = (formData: Partial<UnreconcilePayment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/unreconcile-payment") },
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
      <Button variant="ghost" onClick={() => router.push("/unreconcile-payment")}>← Back</Button>
      <UnreconcilePaymentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}