"use client";

// Detail page for Mode of Payment
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useModeOfPayment, useUpdateModeOfPayment } from "../hooks/mode-of-payment.hooks.js";
import { ModeOfPaymentForm } from "../forms/mode-of-payment-form.js";
import type { ModeOfPayment } from "../types/mode-of-payment.js";
import { Button } from "@/components/ui/button";

export function ModeOfPaymentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useModeOfPayment(params.id);
  const updateMutation = useUpdateModeOfPayment();

  const handleSubmit = (formData: Partial<ModeOfPayment>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/mode-of-payment") },
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
      <Button variant="ghost" onClick={() => router.push("/mode-of-payment")}>← Back</Button>
      <ModeOfPaymentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}