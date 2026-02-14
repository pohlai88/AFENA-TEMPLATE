"use client";

// Detail page for Payment Request
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentRequest, useUpdatePaymentRequest } from "../hooks/payment-request.hooks.js";
import { PaymentRequestForm } from "../forms/payment-request-form.js";
import type { PaymentRequest } from "../types/payment-request.js";
import { Button } from "@/components/ui/button";

export function PaymentRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentRequest(params.id);
  const updateMutation = useUpdatePaymentRequest();

  const handleSubmit = (formData: Partial<PaymentRequest>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-request") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-request")}>← Back</Button>
      <PaymentRequestForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}