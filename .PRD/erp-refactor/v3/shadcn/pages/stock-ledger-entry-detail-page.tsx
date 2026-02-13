"use client";

// Detail page for Stock Ledger Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockLedgerEntry, useUpdateStockLedgerEntry } from "../hooks/stock-ledger-entry.hooks.js";
import { StockLedgerEntryForm } from "../forms/stock-ledger-entry-form.js";
import type { StockLedgerEntry } from "../types/stock-ledger-entry.js";
import { Button } from "@/components/ui/button";

export function StockLedgerEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockLedgerEntry(params.id);
  const updateMutation = useUpdateStockLedgerEntry();

  const handleSubmit = (formData: Partial<StockLedgerEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-ledger-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-ledger-entry")}>← Back</Button>
      <StockLedgerEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}