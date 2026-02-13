"use client";

// Detail page for Payment Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentEntry, useUpdatePaymentEntry } from "../hooks/payment-entry.hooks.js";
import { PaymentEntryForm } from "../forms/payment-entry-form.js";
import type { PaymentEntry } from "../types/payment-entry.js";
import { Button } from "@/components/ui/button";

export function PaymentEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentEntry(params.id);
  const updateMutation = useUpdatePaymentEntry();

  const handleSubmit = (formData: Partial<PaymentEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-entry")}>← Back</Button>
      <PaymentEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}