"use client";

// Detail page for Purchase Receipt
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseReceipt, useUpdatePurchaseReceipt } from "../hooks/purchase-receipt.hooks.js";
import { PurchaseReceiptForm } from "../forms/purchase-receipt-form.js";
import type { PurchaseReceipt } from "../types/purchase-receipt.js";
import { Button } from "@/components/ui/button";

export function PurchaseReceiptDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseReceipt(params.id);
  const updateMutation = useUpdatePurchaseReceipt();

  const handleSubmit = (formData: Partial<PurchaseReceipt>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-receipt") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-receipt")}>← Back</Button>
      <PurchaseReceiptForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}