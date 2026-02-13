"use client";

// Detail page for Subcontracting Receipt Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingReceiptItem, useUpdateSubcontractingReceiptItem } from "../hooks/subcontracting-receipt-item.hooks.js";
import { SubcontractingReceiptItemForm } from "../forms/subcontracting-receipt-item-form.js";
import type { SubcontractingReceiptItem } from "../types/subcontracting-receipt-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingReceiptItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingReceiptItem(params.id);
  const updateMutation = useUpdateSubcontractingReceiptItem();

  const handleSubmit = (formData: Partial<SubcontractingReceiptItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-receipt-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-receipt-item")}>← Back</Button>
      <SubcontractingReceiptItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}