"use client";

// Detail page for Stock Entry Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockEntryDetail, useUpdateStockEntryDetail } from "../hooks/stock-entry-detail.hooks.js";
import { StockEntryDetailForm } from "../forms/stock-entry-detail-form.js";
import type { StockEntryDetail } from "../types/stock-entry-detail.js";
import { Button } from "@/components/ui/button";

export function StockEntryDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockEntryDetail(params.id);
  const updateMutation = useUpdateStockEntryDetail();

  const handleSubmit = (formData: Partial<StockEntryDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-entry-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-entry-detail")}>← Back</Button>
      <StockEntryDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}