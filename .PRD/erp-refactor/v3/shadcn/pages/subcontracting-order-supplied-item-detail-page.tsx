"use client";

// Detail page for Subcontracting Order Supplied Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingOrderSuppliedItem, useUpdateSubcontractingOrderSuppliedItem } from "../hooks/subcontracting-order-supplied-item.hooks.js";
import { SubcontractingOrderSuppliedItemForm } from "../forms/subcontracting-order-supplied-item-form.js";
import type { SubcontractingOrderSuppliedItem } from "../types/subcontracting-order-supplied-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingOrderSuppliedItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingOrderSuppliedItem(params.id);
  const updateMutation = useUpdateSubcontractingOrderSuppliedItem();

  const handleSubmit = (formData: Partial<SubcontractingOrderSuppliedItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-order-supplied-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-order-supplied-item")}>← Back</Button>
      <SubcontractingOrderSuppliedItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}