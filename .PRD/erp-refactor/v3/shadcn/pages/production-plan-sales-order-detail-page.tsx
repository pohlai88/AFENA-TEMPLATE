"use client";

// Detail page for Production Plan Sales Order
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProductionPlanSalesOrder, useUpdateProductionPlanSalesOrder } from "../hooks/production-plan-sales-order.hooks.js";
import { ProductionPlanSalesOrderForm } from "../forms/production-plan-sales-order-form.js";
import type { ProductionPlanSalesOrder } from "../types/production-plan-sales-order.js";
import { Button } from "@/components/ui/button";

export function ProductionPlanSalesOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProductionPlanSalesOrder(params.id);
  const updateMutation = useUpdateProductionPlanSalesOrder();

  const handleSubmit = (formData: Partial<ProductionPlanSalesOrder>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/production-plan-sales-order") },
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
      <Button variant="ghost" onClick={() => router.push("/production-plan-sales-order")}>← Back</Button>
      <ProductionPlanSalesOrderForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}