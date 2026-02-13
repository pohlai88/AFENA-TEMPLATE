"use client";

// Detail page for Subcontracting Inward Order Received Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingInwardOrderReceivedItem, useUpdateSubcontractingInwardOrderReceivedItem } from "../hooks/subcontracting-inward-order-received-item.hooks.js";
import { SubcontractingInwardOrderReceivedItemForm } from "../forms/subcontracting-inward-order-received-item-form.js";
import type { SubcontractingInwardOrderReceivedItem } from "../types/subcontracting-inward-order-received-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingInwardOrderReceivedItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingInwardOrderReceivedItem(params.id);
  const updateMutation = useUpdateSubcontractingInwardOrderReceivedItem();

  const handleSubmit = (formData: Partial<SubcontractingInwardOrderReceivedItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-inward-order-received-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-inward-order-received-item")}>← Back</Button>
      <SubcontractingInwardOrderReceivedItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}