"use client";

// Detail page for Stock Reposting Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useStockRepostingSettings, useUpdateStockRepostingSettings } from "../hooks/stock-reposting-settings.hooks.js";
import { StockRepostingSettingsForm } from "../forms/stock-reposting-settings-form.js";
import type { StockRepostingSettings } from "../types/stock-reposting-settings.js";
import { Button } from "@/components/ui/button";

export function StockRepostingSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useStockRepostingSettings(params.id);
  const updateMutation = useUpdateStockRepostingSettings();

  const handleSubmit = (formData: Partial<StockRepostingSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/stock-reposting-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/stock-reposting-settings")}>← Back</Button>
      <StockRepostingSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}