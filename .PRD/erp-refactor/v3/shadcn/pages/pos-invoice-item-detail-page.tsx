"use client";

// Detail page for POS Invoice Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosInvoiceItem, useUpdatePosInvoiceItem } from "../hooks/pos-invoice-item.hooks.js";
import { PosInvoiceItemForm } from "../forms/pos-invoice-item-form.js";
import type { PosInvoiceItem } from "../types/pos-invoice-item.js";
import { Button } from "@/components/ui/button";

export function PosInvoiceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosInvoiceItem(params.id);
  const updateMutation = useUpdatePosInvoiceItem();

  const handleSubmit = (formData: Partial<PosInvoiceItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-invoice-item") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-invoice-item")}>← Back</Button>
      <PosInvoiceItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}