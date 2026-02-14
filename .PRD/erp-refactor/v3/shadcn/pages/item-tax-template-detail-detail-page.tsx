"use client";

// Detail page for Item Tax Template Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemTaxTemplateDetail, useUpdateItemTaxTemplateDetail } from "../hooks/item-tax-template-detail.hooks.js";
import { ItemTaxTemplateDetailForm } from "../forms/item-tax-template-detail-form.js";
import type { ItemTaxTemplateDetail } from "../types/item-tax-template-detail.js";
import { Button } from "@/components/ui/button";

export function ItemTaxTemplateDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemTaxTemplateDetail(params.id);
  const updateMutation = useUpdateItemTaxTemplateDetail();

  const handleSubmit = (formData: Partial<ItemTaxTemplateDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-tax-template-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/item-tax-template-detail")}>← Back</Button>
      <ItemTaxTemplateDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}