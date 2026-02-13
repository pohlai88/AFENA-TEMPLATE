"use client";

// Detail page for Promotional Scheme Price Discount
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePromotionalSchemePriceDiscount, useUpdatePromotionalSchemePriceDiscount } from "../hooks/promotional-scheme-price-discount.hooks.js";
import { PromotionalSchemePriceDiscountForm } from "../forms/promotional-scheme-price-discount-form.js";
import type { PromotionalSchemePriceDiscount } from "../types/promotional-scheme-price-discount.js";
import { Button } from "@/components/ui/button";

export function PromotionalSchemePriceDiscountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePromotionalSchemePriceDiscount(params.id);
  const updateMutation = useUpdatePromotionalSchemePriceDiscount();

  const handleSubmit = (formData: Partial<PromotionalSchemePriceDiscount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/promotional-scheme-price-discount") },
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
      <Button variant="ghost" onClick={() => router.push("/promotional-scheme-price-discount")}>← Back</Button>
      <PromotionalSchemePriceDiscountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}