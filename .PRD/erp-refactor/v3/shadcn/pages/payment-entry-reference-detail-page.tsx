"use client";

// Detail page for Payment Entry Reference
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentEntryReference, useUpdatePaymentEntryReference } from "../hooks/payment-entry-reference.hooks.js";
import { PaymentEntryReferenceForm } from "../forms/payment-entry-reference-form.js";
import type { PaymentEntryReference } from "../types/payment-entry-reference.js";
import { Button } from "@/components/ui/button";

export function PaymentEntryReferenceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentEntryReference(params.id);
  const updateMutation = useUpdatePaymentEntryReference();

  const handleSubmit = (formData: Partial<PaymentEntryReference>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-entry-reference") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-entry-reference")}>← Back</Button>
      <PaymentEntryReferenceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}