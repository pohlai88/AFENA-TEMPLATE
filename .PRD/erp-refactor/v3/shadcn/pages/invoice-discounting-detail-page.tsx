"use client";

// Detail page for Invoice Discounting
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useInvoiceDiscounting, useUpdateInvoiceDiscounting } from "../hooks/invoice-discounting.hooks.js";
import { InvoiceDiscountingForm } from "../forms/invoice-discounting-form.js";
import type { InvoiceDiscounting } from "../types/invoice-discounting.js";
import { Button } from "@/components/ui/button";

export function InvoiceDiscountingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useInvoiceDiscounting(params.id);
  const updateMutation = useUpdateInvoiceDiscounting();

  const handleSubmit = (formData: Partial<InvoiceDiscounting>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/invoice-discounting") },
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
      <Button variant="ghost" onClick={() => router.push("/invoice-discounting")}>← Back</Button>
      <InvoiceDiscountingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}