"use client";

// Detail page for Stock Entry Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockEntryType, useUpdateStockEntryType } from "../hooks/stock-entry-type.hooks.js";
import { StockEntryTypeForm } from "../forms/stock-entry-type-form.js";
import type { StockEntryType } from "../types/stock-entry-type.js";
import { Button } from "@/components/ui/button";

export function StockEntryTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockEntryType(params.id);
  const updateMutation = useUpdateStockEntryType();

  const handleSubmit = (formData: Partial<StockEntryType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-entry-type") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-entry-type")}>← Back</Button>
      <StockEntryTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}