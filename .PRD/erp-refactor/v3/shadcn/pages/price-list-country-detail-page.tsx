"use client";

// Detail page for Price List Country
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePriceListCountry, useUpdatePriceListCountry } from "../hooks/price-list-country.hooks.js";
import { PriceListCountryForm } from "../forms/price-list-country-form.js";
import type { PriceListCountry } from "../types/price-list-country.js";
import { Button } from "@/components/ui/button";

export function PriceListCountryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePriceListCountry(params.id);
  const updateMutation = useUpdatePriceListCountry();

  const handleSubmit = (formData: Partial<PriceListCountry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/price-list-country") },
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
      <Button variant="ghost" onClick={() => router.push("/price-list-country")}>← Back</Button>
      <PriceListCountryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}