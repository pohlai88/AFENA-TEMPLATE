"use client";

// Detail page for Work Order Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkOrderItem, useUpdateWorkOrderItem } from "../hooks/work-order-item.hooks.js";
import { WorkOrderItemForm } from "../forms/work-order-item-form.js";
import type { WorkOrderItem } from "../types/work-order-item.js";
import { Button } from "@/components/ui/button";

export function WorkOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkOrderItem(params.id);
  const updateMutation = useUpdateWorkOrderItem();

  const handleSubmit = (formData: Partial<WorkOrderItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/work-order-item") },
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
      <Button variant="ghost" onClick={() => router.push("/work-order-item")}>← Back</Button>
      <WorkOrderItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}