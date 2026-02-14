"use client";

// Detail page for Quotation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQuotation, useUpdateQuotation } from "../hooks/quotation.hooks.js";
import { QuotationForm } from "../forms/quotation-form.js";
import type { Quotation } from "../types/quotation.js";
import { Button } from "@/components/ui/button";

export function QuotationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQuotation(params.id);
  const updateMutation = useUpdateQuotation();

  const handleSubmit = (formData: Partial<Quotation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quotation") },
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
      <Button variant="ghost" onClick={() => router.push("/quotation")}>← Back</Button>
      <QuotationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}