"use client";

// Detail page for Sales Forecast Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesForecastItem, useUpdateSalesForecastItem } from "../hooks/sales-forecast-item.hooks.js";
import { SalesForecastItemForm } from "../forms/sales-forecast-item-form.js";
import type { SalesForecastItem } from "../types/sales-forecast-item.js";
import { Button } from "@/components/ui/button";

export function SalesForecastItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesForecastItem(params.id);
  const updateMutation = useUpdateSalesForecastItem();

  const handleSubmit = (formData: Partial<SalesForecastItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-forecast-item") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-forecast-item")}>← Back</Button>
      <SalesForecastItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}