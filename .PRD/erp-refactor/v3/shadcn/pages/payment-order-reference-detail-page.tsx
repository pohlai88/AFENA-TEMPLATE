"use client";

// Detail page for Payment Order Reference
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentOrderReference, useUpdatePaymentOrderReference } from "../hooks/payment-order-reference.hooks.js";
import { PaymentOrderReferenceForm } from "../forms/payment-order-reference-form.js";
import type { PaymentOrderReference } from "../types/payment-order-reference.js";
import { Button } from "@/components/ui/button";

export function PaymentOrderReferenceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentOrderReference(params.id);
  const updateMutation = useUpdatePaymentOrderReference();

  const handleSubmit = (formData: Partial<PaymentOrderReference>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-order-reference") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-order-reference")}>← Back</Button>
      <PaymentOrderReferenceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}