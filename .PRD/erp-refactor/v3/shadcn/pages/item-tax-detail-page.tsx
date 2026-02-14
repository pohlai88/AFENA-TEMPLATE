"use client";

// Detail page for Item Tax
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemTax, useUpdateItemTax } from "../hooks/item-tax.hooks.js";
import { ItemTaxForm } from "../forms/item-tax-form.js";
import type { ItemTax } from "../types/item-tax.js";
import { Button } from "@/components/ui/button";

export function ItemTaxDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemTax(params.id);
  const updateMutation = useUpdateItemTax();

  const handleSubmit = (formData: Partial<ItemTax>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-tax") },
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
      <Button variant="ghost" onClick={() => router.push("/item-tax")}>← Back</Button>
      <ItemTaxForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}