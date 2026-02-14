"use client";

// Detail page for Purchase Receipt Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseReceiptItem, useUpdatePurchaseReceiptItem } from "../hooks/purchase-receipt-item.hooks.js";
import { PurchaseReceiptItemForm } from "../forms/purchase-receipt-item-form.js";
import type { PurchaseReceiptItem } from "../types/purchase-receipt-item.js";
import { Button } from "@/components/ui/button";

export function PurchaseReceiptItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseReceiptItem(params.id);
  const updateMutation = useUpdatePurchaseReceiptItem();

  const handleSubmit = (formData: Partial<PurchaseReceiptItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-receipt-item") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-receipt-item")}>← Back</Button>
      <PurchaseReceiptItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}