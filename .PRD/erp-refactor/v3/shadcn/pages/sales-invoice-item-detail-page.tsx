"use client";

// Detail page for Sales Invoice Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesInvoiceItem, useUpdateSalesInvoiceItem } from "../hooks/sales-invoice-item.hooks.js";
import { SalesInvoiceItemForm } from "../forms/sales-invoice-item-form.js";
import type { SalesInvoiceItem } from "../types/sales-invoice-item.js";
import { Button } from "@/components/ui/button";

export function SalesInvoiceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesInvoiceItem(params.id);
  const updateMutation = useUpdateSalesInvoiceItem();

  const handleSubmit = (formData: Partial<SalesInvoiceItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-invoice-item") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-invoice-item")}>← Back</Button>
      <SalesInvoiceItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}