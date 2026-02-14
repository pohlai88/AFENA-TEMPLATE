"use client";

// Detail page for Currency Exchange
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCurrencyExchange, useUpdateCurrencyExchange } from "../hooks/currency-exchange.hooks.js";
import { CurrencyExchangeForm } from "../forms/currency-exchange-form.js";
import type { CurrencyExchange } from "../types/currency-exchange.js";
import { Button } from "@/components/ui/button";

export function CurrencyExchangeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCurrencyExchange(params.id);
  const updateMutation = useUpdateCurrencyExchange();

  const handleSubmit = (formData: Partial<CurrencyExchange>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/currency-exchange") },
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
      <Button variant="ghost" onClick={() => router.push("/currency-exchange")}>← Back</Button>
      <CurrencyExchangeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}