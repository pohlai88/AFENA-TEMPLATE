"use client";

// Detail page for Quotation Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQuotationLostReasonDetail, useUpdateQuotationLostReasonDetail } from "../hooks/quotation-lost-reason-detail.hooks.js";
import { QuotationLostReasonDetailForm } from "../forms/quotation-lost-reason-detail-form.js";
import type { QuotationLostReasonDetail } from "../types/quotation-lost-reason-detail.js";
import { Button } from "@/components/ui/button";

export function QuotationLostReasonDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQuotationLostReasonDetail(params.id);
  const updateMutation = useUpdateQuotationLostReasonDetail();

  const handleSubmit = (formData: Partial<QuotationLostReasonDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quotation-lost-reason-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/quotation-lost-reason-detail")}>← Back</Button>
      <QuotationLostReasonDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}