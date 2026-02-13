"use client";

// Detail page for Bank Transaction Payments
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankTransactionPayments, useUpdateBankTransactionPayments } from "../hooks/bank-transaction-payments.hooks.js";
import { BankTransactionPaymentsForm } from "../forms/bank-transaction-payments-form.js";
import type { BankTransactionPayments } from "../types/bank-transaction-payments.js";
import { Button } from "@/components/ui/button";

export function BankTransactionPaymentsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankTransactionPayments(params.id);
  const updateMutation = useUpdateBankTransactionPayments();

  const handleSubmit = (formData: Partial<BankTransactionPayments>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-transaction-payments") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-transaction-payments")}>← Back</Button>
      <BankTransactionPaymentsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}