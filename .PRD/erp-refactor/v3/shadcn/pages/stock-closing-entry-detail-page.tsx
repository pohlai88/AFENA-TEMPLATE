"use client";

// Detail page for Stock Closing Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockClosingEntry, useUpdateStockClosingEntry } from "../hooks/stock-closing-entry.hooks.js";
import { StockClosingEntryForm } from "../forms/stock-closing-entry-form.js";
import type { StockClosingEntry } from "../types/stock-closing-entry.js";
import { Button } from "@/components/ui/button";

export function StockClosingEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockClosingEntry(params.id);
  const updateMutation = useUpdateStockClosingEntry();

  const handleSubmit = (formData: Partial<StockClosingEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-closing-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-closing-entry")}>← Back</Button>
      <StockClosingEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}