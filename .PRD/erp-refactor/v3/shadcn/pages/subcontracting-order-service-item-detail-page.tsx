"use client";

// Detail page for Subcontracting Order Service Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingOrderServiceItem, useUpdateSubcontractingOrderServiceItem } from "../hooks/subcontracting-order-service-item.hooks.js";
import { SubcontractingOrderServiceItemForm } from "../forms/subcontracting-order-service-item-form.js";
import type { SubcontractingOrderServiceItem } from "../types/subcontracting-order-service-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingOrderServiceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingOrderServiceItem(params.id);
  const updateMutation = useUpdateSubcontractingOrderServiceItem();

  const handleSubmit = (formData: Partial<SubcontractingOrderServiceItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-order-service-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-order-service-item")}>← Back</Button>
      <SubcontractingOrderServiceItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}