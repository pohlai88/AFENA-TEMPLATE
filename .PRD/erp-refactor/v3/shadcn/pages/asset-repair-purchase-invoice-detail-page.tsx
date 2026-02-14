"use client";

// Detail page for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetRepairPurchaseInvoice, useUpdateAssetRepairPurchaseInvoice } from "../hooks/asset-repair-purchase-invoice.hooks.js";
import { AssetRepairPurchaseInvoiceForm } from "../forms/asset-repair-purchase-invoice-form.js";
import type { AssetRepairPurchaseInvoice } from "../types/asset-repair-purchase-invoice.js";
import { Button } from "@/components/ui/button";

export function AssetRepairPurchaseInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetRepairPurchaseInvoice(params.id);
  const updateMutation = useUpdateAssetRepairPurchaseInvoice();

  const handleSubmit = (formData: Partial<AssetRepairPurchaseInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-repair-purchase-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-repair-purchase-invoice")}>← Back</Button>
      <AssetRepairPurchaseInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}