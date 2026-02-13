"use client";

// Detail page for Subcontracting Receipt
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingReceipt, useUpdateSubcontractingReceipt } from "../hooks/subcontracting-receipt.hooks.js";
import { SubcontractingReceiptForm } from "../forms/subcontracting-receipt-form.js";
import type { SubcontractingReceipt } from "../types/subcontracting-receipt.js";
import { Button } from "@/components/ui/button";

export function SubcontractingReceiptDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingReceipt(params.id);
  const updateMutation = useUpdateSubcontractingReceipt();

  const handleSubmit = (formData: Partial<SubcontractingReceipt>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-receipt") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-receipt")}>← Back</Button>
      <SubcontractingReceiptForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}