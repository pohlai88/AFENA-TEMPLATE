"use client";

// Detail page for Purchase Receipt Item Supplied
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseReceiptItemSupplied, useUpdatePurchaseReceiptItemSupplied } from "../hooks/purchase-receipt-item-supplied.hooks.js";
import { PurchaseReceiptItemSuppliedForm } from "../forms/purchase-receipt-item-supplied-form.js";
import type { PurchaseReceiptItemSupplied } from "../types/purchase-receipt-item-supplied.js";
import { Button } from "@/components/ui/button";

export function PurchaseReceiptItemSuppliedDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseReceiptItemSupplied(params.id);
  const updateMutation = useUpdatePurchaseReceiptItemSupplied();

  const handleSubmit = (formData: Partial<PurchaseReceiptItemSupplied>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-receipt-item-supplied") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-receipt-item-supplied")}>← Back</Button>
      <PurchaseReceiptItemSuppliedForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}