"use client";

// Detail page for Quotation Lost Reason
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQuotationLostReason, useUpdateQuotationLostReason } from "../hooks/quotation-lost-reason.hooks.js";
import { QuotationLostReasonForm } from "../forms/quotation-lost-reason-form.js";
import type { QuotationLostReason } from "../types/quotation-lost-reason.js";
import { Button } from "@/components/ui/button";

export function QuotationLostReasonDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQuotationLostReason(params.id);
  const updateMutation = useUpdateQuotationLostReason();

  const handleSubmit = (formData: Partial<QuotationLostReason>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quotation-lost-reason") },
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
      <Button variant="ghost" onClick={() => router.push("/quotation-lost-reason")}>← Back</Button>
      <QuotationLostReasonForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}