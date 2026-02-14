"use client";

// Detail page for Stock Reconciliation Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockReconciliationItem, useUpdateStockReconciliationItem } from "../hooks/stock-reconciliation-item.hooks.js";
import { StockReconciliationItemForm } from "../forms/stock-reconciliation-item-form.js";
import type { StockReconciliationItem } from "../types/stock-reconciliation-item.js";
import { Button } from "@/components/ui/button";

export function StockReconciliationItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockReconciliationItem(params.id);
  const updateMutation = useUpdateStockReconciliationItem();

  const handleSubmit = (formData: Partial<StockReconciliationItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-reconciliation-item") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-reconciliation-item")}>← Back</Button>
      <StockReconciliationItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}