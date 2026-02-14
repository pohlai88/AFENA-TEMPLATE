"use client";

// Detail page for Purchase Taxes and Charges
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePurchaseTaxesAndCharges, useUpdatePurchaseTaxesAndCharges } from "../hooks/purchase-taxes-and-charges.hooks.js";
import { PurchaseTaxesAndChargesForm } from "../forms/purchase-taxes-and-charges-form.js";
import type { PurchaseTaxesAndCharges } from "../types/purchase-taxes-and-charges.js";
import { Button } from "@/components/ui/button";

export function PurchaseTaxesAndChargesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePurchaseTaxesAndCharges(params.id);
  const updateMutation = useUpdatePurchaseTaxesAndCharges();

  const handleSubmit = (formData: Partial<PurchaseTaxesAndCharges>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/purchase-taxes-and-charges") },
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
      <Button variant="ghost" onClick={() => router.push("/purchase-taxes-and-charges")}>← Back</Button>
      <PurchaseTaxesAndChargesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}