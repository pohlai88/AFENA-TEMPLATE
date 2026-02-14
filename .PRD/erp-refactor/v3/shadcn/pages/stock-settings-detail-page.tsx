"use client";

// Detail page for Stock Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockSettings, useUpdateStockSettings } from "../hooks/stock-settings.hooks.js";
import { StockSettingsForm } from "../forms/stock-settings-form.js";
import type { StockSettings } from "../types/stock-settings.js";
import { Button } from "@/components/ui/button";

export function StockSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockSettings(params.id);
  const updateMutation = useUpdateStockSettings();

  const handleSubmit = (formData: Partial<StockSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-settings")}>← Back</Button>
      <StockSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}