"use client";

// Detail page for Discounted Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDiscountedInvoice, useUpdateDiscountedInvoice } from "../hooks/discounted-invoice.hooks.js";
import { DiscountedInvoiceForm } from "../forms/discounted-invoice-form.js";
import type { DiscountedInvoice } from "../types/discounted-invoice.js";
import { Button } from "@/components/ui/button";

export function DiscountedInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDiscountedInvoice(params.id);
  const updateMutation = useUpdateDiscountedInvoice();

  const handleSubmit = (formData: Partial<DiscountedInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/discounted-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/discounted-invoice")}>← Back</Button>
      <DiscountedInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}