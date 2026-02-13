"use client";

// Detail page for Advance Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAdvancePaymentLedgerEntry, useUpdateAdvancePaymentLedgerEntry } from "../hooks/advance-payment-ledger-entry.hooks.js";
import { AdvancePaymentLedgerEntryForm } from "../forms/advance-payment-ledger-entry-form.js";
import type { AdvancePaymentLedgerEntry } from "../types/advance-payment-ledger-entry.js";
import { Button } from "@/components/ui/button";

export function AdvancePaymentLedgerEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAdvancePaymentLedgerEntry(params.id);
  const updateMutation = useUpdateAdvancePaymentLedgerEntry();

  const handleSubmit = (formData: Partial<AdvancePaymentLedgerEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/advance-payment-ledger-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/advance-payment-ledger-entry")}>← Back</Button>
      <AdvancePaymentLedgerEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}