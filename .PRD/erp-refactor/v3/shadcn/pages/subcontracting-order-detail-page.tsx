"use client";

// Detail page for Subcontracting Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingOrder, useUpdateSubcontractingOrder } from "../hooks/subcontracting-order.hooks.js";
import { SubcontractingOrderForm } from "../forms/subcontracting-order-form.js";
import type { SubcontractingOrder } from "../types/subcontracting-order.js";
import { Button } from "@/components/ui/button";

export function SubcontractingOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingOrder(params.id);
  const updateMutation = useUpdateSubcontractingOrder();

  const handleSubmit = (formData: Partial<SubcontractingOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-order") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-order")}>← Back</Button>
      <SubcontractingOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}