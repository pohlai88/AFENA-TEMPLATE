"use client";

// Detail page for Sales Forecast
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesForecast, useUpdateSalesForecast } from "../hooks/sales-forecast.hooks.js";
import { SalesForecastForm } from "../forms/sales-forecast-form.js";
import type { SalesForecast } from "../types/sales-forecast.js";
import { Button } from "@/components/ui/button";

export function SalesForecastDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesForecast(params.id);
  const updateMutation = useUpdateSalesForecast();

  const handleSubmit = (formData: Partial<SalesForecast>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-forecast") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-forecast")}>← Back</Button>
      <SalesForecastForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}