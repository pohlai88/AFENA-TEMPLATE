"use client";

// Detail page for Exchange Rate Revaluation Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useExchangeRateRevaluationAccount, useUpdateExchangeRateRevaluationAccount } from "../hooks/exchange-rate-revaluation-account.hooks.js";
import { ExchangeRateRevaluationAccountForm } from "../forms/exchange-rate-revaluation-account-form.js";
import type { ExchangeRateRevaluationAccount } from "../types/exchange-rate-revaluation-account.js";
import { Button } from "@/components/ui/button";

export function ExchangeRateRevaluationAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useExchangeRateRevaluationAccount(params.id);
  const updateMutation = useUpdateExchangeRateRevaluationAccount();

  const handleSubmit = (formData: Partial<ExchangeRateRevaluationAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/exchange-rate-revaluation-account") },
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
      <Button variant="ghost" onClick={() => router.push("/exchange-rate-revaluation-account")}>← Back</Button>
      <ExchangeRateRevaluationAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}