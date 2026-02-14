"use client";

// Detail page for Sales Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesOrder, useUpdateSalesOrder } from "../hooks/sales-order.hooks.js";
import { SalesOrderForm } from "../forms/sales-order-form.js";
import type { SalesOrder } from "../types/sales-order.js";
import { Button } from "@/components/ui/button";

export function SalesOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesOrder(params.id);
  const updateMutation = useUpdateSalesOrder();

  const handleSubmit = (formData: Partial<SalesOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-order") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-order")}>← Back</Button>
      <SalesOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}