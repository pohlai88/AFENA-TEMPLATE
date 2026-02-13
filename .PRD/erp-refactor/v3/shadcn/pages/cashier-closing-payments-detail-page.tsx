"use client";

// Detail page for Cashier Closing Payments
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCashierClosingPayments, useUpdateCashierClosingPayments } from "../hooks/cashier-closing-payments.hooks.js";
import { CashierClosingPaymentsForm } from "../forms/cashier-closing-payments-form.js";
import type { CashierClosingPayments } from "../types/cashier-closing-payments.js";
import { Button } from "@/components/ui/button";

export function CashierClosingPaymentsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCashierClosingPayments(params.id);
  const updateMutation = useUpdateCashierClosingPayments();

  const handleSubmit = (formData: Partial<CashierClosingPayments>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/cashier-closing-payments") },
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
      <Button variant="ghost" onClick={() => router.push("/cashier-closing-payments")}>← Back</Button>
      <CashierClosingPaymentsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}