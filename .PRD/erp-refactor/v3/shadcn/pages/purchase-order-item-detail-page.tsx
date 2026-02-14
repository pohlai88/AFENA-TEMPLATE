"use client";

// Detail page for Purchase Order Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseOrderItem, useUpdatePurchaseOrderItem } from "../hooks/purchase-order-item.hooks.js";
import { PurchaseOrderItemForm } from "../forms/purchase-order-item-form.js";
import type { PurchaseOrderItem } from "../types/purchase-order-item.js";
import { Button } from "@/components/ui/button";

export function PurchaseOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseOrderItem(params.id);
  const updateMutation = useUpdatePurchaseOrderItem();

  const handleSubmit = (formData: Partial<PurchaseOrderItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-order-item") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-order-item")}>← Back</Button>
      <PurchaseOrderItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}