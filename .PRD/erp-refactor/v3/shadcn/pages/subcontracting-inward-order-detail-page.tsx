"use client";

// Detail page for Subcontracting Inward Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingInwardOrder, useUpdateSubcontractingInwardOrder } from "../hooks/subcontracting-inward-order.hooks.js";
import { SubcontractingInwardOrderForm } from "../forms/subcontracting-inward-order-form.js";
import type { SubcontractingInwardOrder } from "../types/subcontracting-inward-order.js";
import { Button } from "@/components/ui/button";

export function SubcontractingInwardOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingInwardOrder(params.id);
  const updateMutation = useUpdateSubcontractingInwardOrder();

  const handleSubmit = (formData: Partial<SubcontractingInwardOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-inward-order") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-inward-order")}>← Back</Button>
      <SubcontractingInwardOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}