"use client";

// Detail page for Subcontracting Inward Order Service Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingInwardOrderServiceItem, useUpdateSubcontractingInwardOrderServiceItem } from "../hooks/subcontracting-inward-order-service-item.hooks.js";
import { SubcontractingInwardOrderServiceItemForm } from "../forms/subcontracting-inward-order-service-item-form.js";
import type { SubcontractingInwardOrderServiceItem } from "../types/subcontracting-inward-order-service-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingInwardOrderServiceItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingInwardOrderServiceItem(params.id);
  const updateMutation = useUpdateSubcontractingInwardOrderServiceItem();

  const handleSubmit = (formData: Partial<SubcontractingInwardOrderServiceItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-inward-order-service-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-inward-order-service-item")}>← Back</Button>
      <SubcontractingInwardOrderServiceItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}