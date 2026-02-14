"use client";

// Detail page for Purchase Order Item Supplied
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseOrderItemSupplied, useUpdatePurchaseOrderItemSupplied } from "../hooks/purchase-order-item-supplied.hooks.js";
import { PurchaseOrderItemSuppliedForm } from "../forms/purchase-order-item-supplied-form.js";
import type { PurchaseOrderItemSupplied } from "../types/purchase-order-item-supplied.js";
import { Button } from "@/components/ui/button";

export function PurchaseOrderItemSuppliedDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseOrderItemSupplied(params.id);
  const updateMutation = useUpdatePurchaseOrderItemSupplied();

  const handleSubmit = (formData: Partial<PurchaseOrderItemSupplied>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-order-item-supplied") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-order-item-supplied")}>← Back</Button>
      <PurchaseOrderItemSuppliedForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}