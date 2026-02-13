"use client";

// Detail page for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemWiseTaxDetail, useUpdateItemWiseTaxDetail } from "../hooks/item-wise-tax-detail.hooks.js";
import { ItemWiseTaxDetailForm } from "../forms/item-wise-tax-detail-form.js";
import type { ItemWiseTaxDetail } from "../types/item-wise-tax-detail.js";
import { Button } from "@/components/ui/button";

export function ItemWiseTaxDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemWiseTaxDetail(params.id);
  const updateMutation = useUpdateItemWiseTaxDetail();

  const handleSubmit = (formData: Partial<ItemWiseTaxDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-wise-tax-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/item-wise-tax-detail")}>← Back</Button>
      <ItemWiseTaxDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}