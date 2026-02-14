"use client";

// Detail page for Request for Quotation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRequestForQuotation, useUpdateRequestForQuotation } from "../hooks/request-for-quotation.hooks.js";
import { RequestForQuotationForm } from "../forms/request-for-quotation-form.js";
import type { RequestForQuotation } from "../types/request-for-quotation.js";
import { Button } from "@/components/ui/button";

export function RequestForQuotationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRequestForQuotation(params.id);
  const updateMutation = useUpdateRequestForQuotation();

  const handleSubmit = (formData: Partial<RequestForQuotation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/request-for-quotation") },
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
      <Button variant="ghost" onClick={() => router.push("/request-for-quotation")}>← Back</Button>
      <RequestForQuotationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}