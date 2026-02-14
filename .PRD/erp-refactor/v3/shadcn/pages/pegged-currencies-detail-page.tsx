"use client";

// Detail page for Pegged Currencies
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePeggedCurrencies, useUpdatePeggedCurrencies } from "../hooks/pegged-currencies.hooks.js";
import { PeggedCurrenciesForm } from "../forms/pegged-currencies-form.js";
import type { PeggedCurrencies } from "../types/pegged-currencies.js";
import { Button } from "@/components/ui/button";

export function PeggedCurrenciesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePeggedCurrencies(params.id);
  const updateMutation = useUpdatePeggedCurrencies();

  const handleSubmit = (formData: Partial<PeggedCurrencies>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pegged-currencies") },
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
      <Button variant="ghost" onClick={() => router.push("/pegged-currencies")}>← Back</Button>
      <PeggedCurrenciesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}