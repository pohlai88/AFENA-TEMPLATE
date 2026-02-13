"use client";

// Detail page for Quick Stock Balance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQuickStockBalance, useUpdateQuickStockBalance } from "../hooks/quick-stock-balance.hooks.js";
import { QuickStockBalanceForm } from "../forms/quick-stock-balance-form.js";
import type { QuickStockBalance } from "../types/quick-stock-balance.js";
import { Button } from "@/components/ui/button";

export function QuickStockBalanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQuickStockBalance(params.id);
  const updateMutation = useUpdateQuickStockBalance();

  const handleSubmit = (formData: Partial<QuickStockBalance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quick-stock-balance") },
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
      <Button variant="ghost" onClick={() => router.push("/quick-stock-balance")}>← Back</Button>
      <QuickStockBalanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}