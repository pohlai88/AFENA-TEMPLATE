"use client";

// Detail page for Blanket Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBlanketOrder, useUpdateBlanketOrder } from "../hooks/blanket-order.hooks.js";
import { BlanketOrderForm } from "../forms/blanket-order-form.js";
import type { BlanketOrder } from "../types/blanket-order.js";
import { Button } from "@/components/ui/button";

export function BlanketOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBlanketOrder(params.id);
  const updateMutation = useUpdateBlanketOrder();

  const handleSubmit = (formData: Partial<BlanketOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/blanket-order") },
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
      <Button variant="ghost" onClick={() => router.push("/blanket-order")}>← Back</Button>
      <BlanketOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}