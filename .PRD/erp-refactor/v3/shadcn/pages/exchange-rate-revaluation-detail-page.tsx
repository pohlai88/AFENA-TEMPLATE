"use client";

// Detail page for Exchange Rate Revaluation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useExchangeRateRevaluation, useUpdateExchangeRateRevaluation } from "../hooks/exchange-rate-revaluation.hooks.js";
import { ExchangeRateRevaluationForm } from "../forms/exchange-rate-revaluation-form.js";
import type { ExchangeRateRevaluation } from "../types/exchange-rate-revaluation.js";
import { Button } from "@/components/ui/button";

export function ExchangeRateRevaluationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useExchangeRateRevaluation(params.id);
  const updateMutation = useUpdateExchangeRateRevaluation();

  const handleSubmit = (formData: Partial<ExchangeRateRevaluation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/exchange-rate-revaluation") },
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
      <Button variant="ghost" onClick={() => router.push("/exchange-rate-revaluation")}>← Back</Button>
      <ExchangeRateRevaluationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}