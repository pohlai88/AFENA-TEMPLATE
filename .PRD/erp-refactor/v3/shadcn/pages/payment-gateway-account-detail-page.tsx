"use client";

// Detail page for Payment Gateway Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentGatewayAccount, useUpdatePaymentGatewayAccount } from "../hooks/payment-gateway-account.hooks.js";
import { PaymentGatewayAccountForm } from "../forms/payment-gateway-account-form.js";
import type { PaymentGatewayAccount } from "../types/payment-gateway-account.js";
import { Button } from "@/components/ui/button";

export function PaymentGatewayAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentGatewayAccount(params.id);
  const updateMutation = useUpdatePaymentGatewayAccount();

  const handleSubmit = (formData: Partial<PaymentGatewayAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-gateway-account") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-gateway-account")}>← Back</Button>
      <PaymentGatewayAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}