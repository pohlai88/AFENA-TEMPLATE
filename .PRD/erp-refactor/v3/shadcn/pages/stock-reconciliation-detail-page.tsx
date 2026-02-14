"use client";

// Detail page for Stock Reconciliation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockReconciliation, useUpdateStockReconciliation } from "../hooks/stock-reconciliation.hooks.js";
import { StockReconciliationForm } from "../forms/stock-reconciliation-form.js";
import type { StockReconciliation } from "../types/stock-reconciliation.js";
import { Button } from "@/components/ui/button";

export function StockReconciliationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockReconciliation(params.id);
  const updateMutation = useUpdateStockReconciliation();

  const handleSubmit = (formData: Partial<StockReconciliation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-reconciliation") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-reconciliation")}>← Back</Button>
      <StockReconciliationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}