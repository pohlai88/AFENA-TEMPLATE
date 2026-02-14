"use client";

// Detail page for Payment Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentOrder, useUpdatePaymentOrder } from "../hooks/payment-order.hooks.js";
import { PaymentOrderForm } from "../forms/payment-order-form.js";
import type { PaymentOrder } from "../types/payment-order.js";
import { Button } from "@/components/ui/button";

export function PaymentOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentOrder(params.id);
  const updateMutation = useUpdatePaymentOrder();

  const handleSubmit = (formData: Partial<PaymentOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-order") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-order")}>← Back</Button>
      <PaymentOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}