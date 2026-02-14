"use client";

// Detail page for Work Order Operation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkOrderOperation, useUpdateWorkOrderOperation } from "../hooks/work-order-operation.hooks.js";
import { WorkOrderOperationForm } from "../forms/work-order-operation-form.js";
import type { WorkOrderOperation } from "../types/work-order-operation.js";
import { Button } from "@/components/ui/button";

export function WorkOrderOperationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkOrderOperation(params.id);
  const updateMutation = useUpdateWorkOrderOperation();

  const handleSubmit = (formData: Partial<WorkOrderOperation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/work-order-operation") },
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
      <Button variant="ghost" onClick={() => router.push("/work-order-operation")}>← Back</Button>
      <WorkOrderOperationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}