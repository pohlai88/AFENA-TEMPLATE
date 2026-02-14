"use client";

// Detail page for Item Tax Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemTaxTemplate, useUpdateItemTaxTemplate } from "../hooks/item-tax-template.hooks.js";
import { ItemTaxTemplateForm } from "../forms/item-tax-template-form.js";
import type { ItemTaxTemplate } from "../types/item-tax-template.js";
import { Button } from "@/components/ui/button";

export function ItemTaxTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemTaxTemplate(params.id);
  const updateMutation = useUpdateItemTaxTemplate();

  const handleSubmit = (formData: Partial<ItemTaxTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-tax-template") },
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
      <Button variant="ghost" onClick={() => router.push("/item-tax-template")}>← Back</Button>
      <ItemTaxTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}