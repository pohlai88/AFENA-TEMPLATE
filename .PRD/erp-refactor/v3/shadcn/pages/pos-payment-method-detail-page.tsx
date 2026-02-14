"use client";

// Detail page for POS Payment Method
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosPaymentMethod, useUpdatePosPaymentMethod } from "../hooks/pos-payment-method.hooks.js";
import { PosPaymentMethodForm } from "../forms/pos-payment-method-form.js";
import type { PosPaymentMethod } from "../types/pos-payment-method.js";
import { Button } from "@/components/ui/button";

export function PosPaymentMethodDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosPaymentMethod(params.id);
  const updateMutation = useUpdatePosPaymentMethod();

  const handleSubmit = (formData: Partial<PosPaymentMethod>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-payment-method") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-payment-method")}>← Back</Button>
      <PosPaymentMethodForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}