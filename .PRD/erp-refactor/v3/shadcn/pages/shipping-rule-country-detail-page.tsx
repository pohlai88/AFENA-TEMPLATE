"use client";

// Detail page for Shipping Rule Country
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShippingRuleCountry, useUpdateShippingRuleCountry } from "../hooks/shipping-rule-country.hooks.js";
import { ShippingRuleCountryForm } from "../forms/shipping-rule-country-form.js";
import type { ShippingRuleCountry } from "../types/shipping-rule-country.js";
import { Button } from "@/components/ui/button";

export function ShippingRuleCountryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShippingRuleCountry(params.id);
  const updateMutation = useUpdateShippingRuleCountry();

  const handleSubmit = (formData: Partial<ShippingRuleCountry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shipping-rule-country") },
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
      <Button variant="ghost" onClick={() => router.push("/shipping-rule-country")}>← Back</Button>
      <ShippingRuleCountryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}