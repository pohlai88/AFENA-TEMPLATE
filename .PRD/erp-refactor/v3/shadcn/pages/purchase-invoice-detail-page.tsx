"use client";

// Detail page for Purchase Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseInvoice, useUpdatePurchaseInvoice } from "../hooks/purchase-invoice.hooks.js";
import { PurchaseInvoiceForm } from "../forms/purchase-invoice-form.js";
import type { PurchaseInvoice } from "../types/purchase-invoice.js";
import { Button } from "@/components/ui/button";

export function PurchaseInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseInvoice(params.id);
  const updateMutation = useUpdatePurchaseInvoice();

  const handleSubmit = (formData: Partial<PurchaseInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-invoice")}>← Back</Button>
      <PurchaseInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}