"use client";

// Detail page for Tax Withholding Category
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxWithholdingCategory, useUpdateTaxWithholdingCategory } from "../hooks/tax-withholding-category.hooks.js";
import { TaxWithholdingCategoryForm } from "../forms/tax-withholding-category-form.js";
import type { TaxWithholdingCategory } from "../types/tax-withholding-category.js";
import { Button } from "@/components/ui/button";

export function TaxWithholdingCategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxWithholdingCategory(params.id);
  const updateMutation = useUpdateTaxWithholdingCategory();

  const handleSubmit = (formData: Partial<TaxWithholdingCategory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-withholding-category") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-withholding-category")}>← Back</Button>
      <TaxWithholdingCategoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}