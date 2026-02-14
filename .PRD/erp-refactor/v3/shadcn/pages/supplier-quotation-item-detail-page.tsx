"use client";

// Detail page for Supplier Quotation Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierQuotationItem, useUpdateSupplierQuotationItem } from "../hooks/supplier-quotation-item.hooks.js";
import { SupplierQuotationItemForm } from "../forms/supplier-quotation-item-form.js";
import type { SupplierQuotationItem } from "../types/supplier-quotation-item.js";
import { Button } from "@/components/ui/button";

export function SupplierQuotationItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierQuotationItem(params.id);
  const updateMutation = useUpdateSupplierQuotationItem();

  const handleSubmit = (formData: Partial<SupplierQuotationItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-quotation-item") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-quotation-item")}>← Back</Button>
      <SupplierQuotationItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}