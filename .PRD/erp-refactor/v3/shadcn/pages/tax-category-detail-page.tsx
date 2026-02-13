"use client";

// Detail page for Tax Category
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxCategory, useUpdateTaxCategory } from "../hooks/tax-category.hooks.js";
import { TaxCategoryForm } from "../forms/tax-category-form.js";
import type { TaxCategory } from "../types/tax-category.js";
import { Button } from "@/components/ui/button";

export function TaxCategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxCategory(params.id);
  const updateMutation = useUpdateTaxCategory();

  const handleSubmit = (formData: Partial<TaxCategory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-category") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-category")}>← Back</Button>
      <TaxCategoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}