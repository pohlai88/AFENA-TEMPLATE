"use client";

// Detail page for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLandedCostVendorInvoice, useUpdateLandedCostVendorInvoice } from "../hooks/landed-cost-vendor-invoice.hooks.js";
import { LandedCostVendorInvoiceForm } from "../forms/landed-cost-vendor-invoice-form.js";
import type { LandedCostVendorInvoice } from "../types/landed-cost-vendor-invoice.js";
import { Button } from "@/components/ui/button";

export function LandedCostVendorInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLandedCostVendorInvoice(params.id);
  const updateMutation = useUpdateLandedCostVendorInvoice();

  const handleSubmit = (formData: Partial<LandedCostVendorInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/landed-cost-vendor-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/landed-cost-vendor-invoice")}>← Back</Button>
      <LandedCostVendorInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}