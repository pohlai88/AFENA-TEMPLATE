"use client";

// Detail page for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCurrencyExchangeSettingsDetails, useUpdateCurrencyExchangeSettingsDetails } from "../hooks/currency-exchange-settings-details.hooks.js";
import { CurrencyExchangeSettingsDetailsForm } from "../forms/currency-exchange-settings-details-form.js";
import type { CurrencyExchangeSettingsDetails } from "../types/currency-exchange-settings-details.js";
import { Button } from "@/components/ui/button";

export function CurrencyExchangeSettingsDetailsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCurrencyExchangeSettingsDetails(params.id);
  const updateMutation = useUpdateCurrencyExchangeSettingsDetails();

  const handleSubmit = (formData: Partial<CurrencyExchangeSettingsDetails>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/currency-exchange-settings-details") },
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
      <Button variant="ghost" onClick={() => router.push("/currency-exchange-settings-details")}>← Back</Button>
      <CurrencyExchangeSettingsDetailsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}