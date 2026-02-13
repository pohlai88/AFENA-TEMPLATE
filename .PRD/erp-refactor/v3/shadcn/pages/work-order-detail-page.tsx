"use client";

// Detail page for Work Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkOrder, useUpdateWorkOrder } from "../hooks/work-order.hooks.js";
import { WorkOrderForm } from "../forms/work-order-form.js";
import type { WorkOrder } from "../types/work-order.js";
import { Button } from "@/components/ui/button";

export function WorkOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkOrder(params.id);
  const updateMutation = useUpdateWorkOrder();

  const handleSubmit = (formData: Partial<WorkOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/work-order") },
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
      <Button variant="ghost" onClick={() => router.push("/work-order")}>← Back</Button>
      <WorkOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}