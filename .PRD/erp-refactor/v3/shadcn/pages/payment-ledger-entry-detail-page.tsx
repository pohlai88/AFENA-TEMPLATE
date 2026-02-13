"use client";

// Detail page for Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentLedgerEntry, useUpdatePaymentLedgerEntry } from "../hooks/payment-ledger-entry.hooks.js";
import { PaymentLedgerEntryForm } from "../forms/payment-ledger-entry-form.js";
import type { PaymentLedgerEntry } from "../types/payment-ledger-entry.js";
import { Button } from "@/components/ui/button";

export function PaymentLedgerEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentLedgerEntry(params.id);
  const updateMutation = useUpdatePaymentLedgerEntry();

  const handleSubmit = (formData: Partial<PaymentLedgerEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-ledger-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-ledger-entry")}>← Back</Button>
      <PaymentLedgerEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}