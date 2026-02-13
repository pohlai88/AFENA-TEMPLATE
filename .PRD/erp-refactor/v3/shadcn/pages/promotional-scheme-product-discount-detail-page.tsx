"use client";

// Detail page for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePromotionalSchemeProductDiscount, useUpdatePromotionalSchemeProductDiscount } from "../hooks/promotional-scheme-product-discount.hooks.js";
import { PromotionalSchemeProductDiscountForm } from "../forms/promotional-scheme-product-discount-form.js";
import type { PromotionalSchemeProductDiscount } from "../types/promotional-scheme-product-discount.js";
import { Button } from "@/components/ui/button";

export function PromotionalSchemeProductDiscountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePromotionalSchemeProductDiscount(params.id);
  const updateMutation = useUpdatePromotionalSchemeProductDiscount();

  const handleSubmit = (formData: Partial<PromotionalSchemeProductDiscount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/promotional-scheme-product-discount") },
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
      <Button variant="ghost" onClick={() => router.push("/promotional-scheme-product-discount")}>← Back</Button>
      <PromotionalSchemeProductDiscountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}