"use client";

// Detail page for Purchase Invoice Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseInvoiceItem, useUpdatePurchaseInvoiceItem } from "../hooks/purchase-invoice-item.hooks.js";
import { PurchaseInvoiceItemForm } from "../forms/purchase-invoice-item-form.js";
import type { PurchaseInvoiceItem } from "../types/purchase-invoice-item.js";
import { Button } from "@/components/ui/button";

export function PurchaseInvoiceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseInvoiceItem(params.id);
  const updateMutation = useUpdatePurchaseInvoiceItem();

  const handleSubmit = (formData: Partial<PurchaseInvoiceItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-invoice-item") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-invoice-item")}>← Back</Button>
      <PurchaseInvoiceItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}