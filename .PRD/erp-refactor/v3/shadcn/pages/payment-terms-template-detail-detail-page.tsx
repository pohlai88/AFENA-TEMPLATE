"use client";

// Detail page for Payment Terms Template Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePaymentTermsTemplateDetail, useUpdatePaymentTermsTemplateDetail } from "../hooks/payment-terms-template-detail.hooks.js";
import { PaymentTermsTemplateDetailForm } from "../forms/payment-terms-template-detail-form.js";
import type { PaymentTermsTemplateDetail } from "../types/payment-terms-template-detail.js";
import { Button } from "@/components/ui/button";

export function PaymentTermsTemplateDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePaymentTermsTemplateDetail(params.id);
  const updateMutation = useUpdatePaymentTermsTemplateDetail();

  const handleSubmit = (formData: Partial<PaymentTermsTemplateDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/payment-terms-template-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/payment-terms-template-detail")}>← Back</Button>
      <PaymentTermsTemplateDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}