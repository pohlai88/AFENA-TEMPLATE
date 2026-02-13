"use client";

// Detail page for Sales Order Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesOrderItem, useUpdateSalesOrderItem } from "../hooks/sales-order-item.hooks.js";
import { SalesOrderItemForm } from "../forms/sales-order-item-form.js";
import type { SalesOrderItem } from "../types/sales-order-item.js";
import { Button } from "@/components/ui/button";

export function SalesOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesOrderItem(params.id);
  const updateMutation = useUpdateSalesOrderItem();

  const handleSubmit = (formData: Partial<SalesOrderItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-order-item") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-order-item")}>← Back</Button>
      <SalesOrderItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}