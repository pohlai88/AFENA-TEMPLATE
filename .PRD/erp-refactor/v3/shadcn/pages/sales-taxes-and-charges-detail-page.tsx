"use client";

// Detail page for Sales Taxes and Charges
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesTaxesAndCharges, useUpdateSalesTaxesAndCharges } from "../hooks/sales-taxes-and-charges.hooks.js";
import { SalesTaxesAndChargesForm } from "../forms/sales-taxes-and-charges-form.js";
import type { SalesTaxesAndCharges } from "../types/sales-taxes-and-charges.js";
import { Button } from "@/components/ui/button";

export function SalesTaxesAndChargesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesTaxesAndCharges(params.id);
  const updateMutation = useUpdateSalesTaxesAndCharges();

  const handleSubmit = (formData: Partial<SalesTaxesAndCharges>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-taxes-and-charges") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-taxes-and-charges")}>← Back</Button>
      <SalesTaxesAndChargesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}