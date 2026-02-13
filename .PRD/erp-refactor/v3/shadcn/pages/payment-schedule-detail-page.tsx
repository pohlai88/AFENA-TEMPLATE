"use client";

// Detail page for Payment Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentSchedule, useUpdatePaymentSchedule } from "../hooks/payment-schedule.hooks.js";
import { PaymentScheduleForm } from "../forms/payment-schedule-form.js";
import type { PaymentSchedule } from "../types/payment-schedule.js";
import { Button } from "@/components/ui/button";

export function PaymentScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentSchedule(params.id);
  const updateMutation = useUpdatePaymentSchedule();

  const handleSubmit = (formData: Partial<PaymentSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-schedule")}>← Back</Button>
      <PaymentScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}