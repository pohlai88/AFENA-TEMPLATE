"use client";

// Detail page for Stock Closing Balance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockClosingBalance, useUpdateStockClosingBalance } from "../hooks/stock-closing-balance.hooks.js";
import { StockClosingBalanceForm } from "../forms/stock-closing-balance-form.js";
import type { StockClosingBalance } from "../types/stock-closing-balance.js";
import { Button } from "@/components/ui/button";

export function StockClosingBalanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockClosingBalance(params.id);
  const updateMutation = useUpdateStockClosingBalance();

  const handleSubmit = (formData: Partial<StockClosingBalance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-closing-balance") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-closing-balance")}>← Back</Button>
      <StockClosingBalanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}