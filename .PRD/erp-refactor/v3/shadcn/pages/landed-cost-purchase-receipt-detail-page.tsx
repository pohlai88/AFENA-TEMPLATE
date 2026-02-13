"use client";

// Detail page for Landed Cost Purchase Receipt
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLandedCostPurchaseReceipt, useUpdateLandedCostPurchaseReceipt } from "../hooks/landed-cost-purchase-receipt.hooks.js";
import { LandedCostPurchaseReceiptForm } from "../forms/landed-cost-purchase-receipt-form.js";
import type { LandedCostPurchaseReceipt } from "../types/landed-cost-purchase-receipt.js";
import { Button } from "@/components/ui/button";

export function LandedCostPurchaseReceiptDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLandedCostPurchaseReceipt(params.id);
  const updateMutation = useUpdateLandedCostPurchaseReceipt();

  const handleSubmit = (formData: Partial<LandedCostPurchaseReceipt>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/landed-cost-purchase-receipt") },
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
      <Button variant="ghost" onClick={() => router.push("/landed-cost-purchase-receipt")}>← Back</Button>
      <LandedCostPurchaseReceiptForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}