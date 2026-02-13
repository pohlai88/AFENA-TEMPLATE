"use client";

// Detail page for POS Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosInvoice, useUpdatePosInvoice } from "../hooks/pos-invoice.hooks.js";
import { PosInvoiceForm } from "../forms/pos-invoice-form.js";
import type { PosInvoice } from "../types/pos-invoice.js";
import { Button } from "@/components/ui/button";

export function PosInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosInvoice(params.id);
  const updateMutation = useUpdatePosInvoice();

  const handleSubmit = (formData: Partial<PosInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-invoice")}>← Back</Button>
      <PosInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}