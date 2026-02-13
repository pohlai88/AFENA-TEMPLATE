"use client";

// Detail page for Subcontracting Order Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingOrderItem, useUpdateSubcontractingOrderItem } from "../hooks/subcontracting-order-item.hooks.js";
import { SubcontractingOrderItemForm } from "../forms/subcontracting-order-item-form.js";
import type { SubcontractingOrderItem } from "../types/subcontracting-order-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingOrderItem(params.id);
  const updateMutation = useUpdateSubcontractingOrderItem();

  const handleSubmit = (formData: Partial<SubcontractingOrderItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-order-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-order-item")}>← Back</Button>
      <SubcontractingOrderItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}