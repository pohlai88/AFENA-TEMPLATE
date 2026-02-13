"use client";

// Detail page for Currency Exchange Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCurrencyExchangeSettings, useUpdateCurrencyExchangeSettings } from "../hooks/currency-exchange-settings.hooks.js";
import { CurrencyExchangeSettingsForm } from "../forms/currency-exchange-settings-form.js";
import type { CurrencyExchangeSettings } from "../types/currency-exchange-settings.js";
import { Button } from "@/components/ui/button";

export function CurrencyExchangeSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCurrencyExchangeSettings(params.id);
  const updateMutation = useUpdateCurrencyExchangeSettings();

  const handleSubmit = (formData: Partial<CurrencyExchangeSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/currency-exchange-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/currency-exchange-settings")}>← Back</Button>
      <CurrencyExchangeSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}