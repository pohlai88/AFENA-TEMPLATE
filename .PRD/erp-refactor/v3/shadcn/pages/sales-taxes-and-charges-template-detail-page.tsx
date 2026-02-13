"use client";

// Detail page for Sales Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesTaxesAndChargesTemplate, useUpdateSalesTaxesAndChargesTemplate } from "../hooks/sales-taxes-and-charges-template.hooks.js";
import { SalesTaxesAndChargesTemplateForm } from "../forms/sales-taxes-and-charges-template-form.js";
import type { SalesTaxesAndChargesTemplate } from "../types/sales-taxes-and-charges-template.js";
import { Button } from "@/components/ui/button";

export function SalesTaxesAndChargesTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesTaxesAndChargesTemplate(params.id);
  const updateMutation = useUpdateSalesTaxesAndChargesTemplate();

  const handleSubmit = (formData: Partial<SalesTaxesAndChargesTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-taxes-and-charges-template") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-taxes-and-charges-template")}>← Back</Button>
      <SalesTaxesAndChargesTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}