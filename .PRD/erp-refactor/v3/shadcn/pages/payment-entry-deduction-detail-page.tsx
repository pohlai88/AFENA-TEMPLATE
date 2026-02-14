"use client";

// Detail page for Payment Entry Deduction
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentEntryDeduction, useUpdatePaymentEntryDeduction } from "../hooks/payment-entry-deduction.hooks.js";
import { PaymentEntryDeductionForm } from "../forms/payment-entry-deduction-form.js";
import type { PaymentEntryDeduction } from "../types/payment-entry-deduction.js";
import { Button } from "@/components/ui/button";

export function PaymentEntryDeductionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentEntryDeduction(params.id);
  const updateMutation = useUpdatePaymentEntryDeduction();

  const handleSubmit = (formData: Partial<PaymentEntryDeduction>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-entry-deduction") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-entry-deduction")}>← Back</Button>
      <PaymentEntryDeductionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}