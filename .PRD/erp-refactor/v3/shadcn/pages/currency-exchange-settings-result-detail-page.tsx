"use client";

// Detail page for Currency Exchange Settings Result
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCurrencyExchangeSettingsResult, useUpdateCurrencyExchangeSettingsResult } from "../hooks/currency-exchange-settings-result.hooks.js";
import { CurrencyExchangeSettingsResultForm } from "../forms/currency-exchange-settings-result-form.js";
import type { CurrencyExchangeSettingsResult } from "../types/currency-exchange-settings-result.js";
import { Button } from "@/components/ui/button";

export function CurrencyExchangeSettingsResultDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCurrencyExchangeSettingsResult(params.id);
  const updateMutation = useUpdateCurrencyExchangeSettingsResult();

  const handleSubmit = (formData: Partial<CurrencyExchangeSettingsResult>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/currency-exchange-settings-result") },
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
      <Button variant="ghost" onClick={() => router.push("/currency-exchange-settings-result")}>← Back</Button>
      <CurrencyExchangeSettingsResultForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}