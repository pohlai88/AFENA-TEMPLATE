"use client";

// Detail page for Subcontracting Receipt Supplied Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingReceiptSuppliedItem, useUpdateSubcontractingReceiptSuppliedItem } from "../hooks/subcontracting-receipt-supplied-item.hooks.js";
import { SubcontractingReceiptSuppliedItemForm } from "../forms/subcontracting-receipt-supplied-item-form.js";
import type { SubcontractingReceiptSuppliedItem } from "../types/subcontracting-receipt-supplied-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingReceiptSuppliedItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingReceiptSuppliedItem(params.id);
  const updateMutation = useUpdateSubcontractingReceiptSuppliedItem();

  const handleSubmit = (formData: Partial<SubcontractingReceiptSuppliedItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-receipt-supplied-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-receipt-supplied-item")}>← Back</Button>
      <SubcontractingReceiptSuppliedItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}