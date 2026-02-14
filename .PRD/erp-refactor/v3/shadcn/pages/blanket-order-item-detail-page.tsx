"use client";

// Detail page for Blanket Order Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBlanketOrderItem, useUpdateBlanketOrderItem } from "../hooks/blanket-order-item.hooks.js";
import { BlanketOrderItemForm } from "../forms/blanket-order-item-form.js";
import type { BlanketOrderItem } from "../types/blanket-order-item.js";
import { Button } from "@/components/ui/button";

export function BlanketOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBlanketOrderItem(params.id);
  const updateMutation = useUpdateBlanketOrderItem();

  const handleSubmit = (formData: Partial<BlanketOrderItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/blanket-order-item") },
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
      <Button variant="ghost" onClick={() => router.push("/blanket-order-item")}>← Back</Button>
      <BlanketOrderItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}