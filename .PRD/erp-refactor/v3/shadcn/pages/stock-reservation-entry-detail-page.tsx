"use client";

// Detail page for Stock Reservation Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockReservationEntry, useUpdateStockReservationEntry } from "../hooks/stock-reservation-entry.hooks.js";
import { StockReservationEntryForm } from "../forms/stock-reservation-entry-form.js";
import type { StockReservationEntry } from "../types/stock-reservation-entry.js";
import { Button } from "@/components/ui/button";

export function StockReservationEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockReservationEntry(params.id);
  const updateMutation = useUpdateStockReservationEntry();

  const handleSubmit = (formData: Partial<StockReservationEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-reservation-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-reservation-entry")}>← Back</Button>
      <StockReservationEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}