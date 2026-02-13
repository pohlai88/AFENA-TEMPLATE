"use client";

// Detail page for Purchase Invoice Advance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseInvoiceAdvance, useUpdatePurchaseInvoiceAdvance } from "../hooks/purchase-invoice-advance.hooks.js";
import { PurchaseInvoiceAdvanceForm } from "../forms/purchase-invoice-advance-form.js";
import type { PurchaseInvoiceAdvance } from "../types/purchase-invoice-advance.js";
import { Button } from "@/components/ui/button";

export function PurchaseInvoiceAdvanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseInvoiceAdvance(params.id);
  const updateMutation = useUpdatePurchaseInvoiceAdvance();

  const handleSubmit = (formData: Partial<PurchaseInvoiceAdvance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-invoice-advance") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-invoice-advance")}>← Back</Button>
      <PurchaseInvoiceAdvanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}