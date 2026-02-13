"use client";

// Detail page for Stock Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockEntry, useUpdateStockEntry } from "../hooks/stock-entry.hooks.js";
import { StockEntryForm } from "../forms/stock-entry-form.js";
import type { StockEntry } from "../types/stock-entry.js";
import { Button } from "@/components/ui/button";

export function StockEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockEntry(params.id);
  const updateMutation = useUpdateStockEntry();

  const handleSubmit = (formData: Partial<StockEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-entry")}>← Back</Button>
      <StockEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}