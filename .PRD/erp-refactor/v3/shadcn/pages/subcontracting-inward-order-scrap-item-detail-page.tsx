"use client";

// Detail page for Subcontracting Inward Order Scrap Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubcontractingInwardOrderScrapItem, useUpdateSubcontractingInwardOrderScrapItem } from "../hooks/subcontracting-inward-order-scrap-item.hooks.js";
import { SubcontractingInwardOrderScrapItemForm } from "../forms/subcontracting-inward-order-scrap-item-form.js";
import type { SubcontractingInwardOrderScrapItem } from "../types/subcontracting-inward-order-scrap-item.js";
import { Button } from "@/components/ui/button";

export function SubcontractingInwardOrderScrapItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubcontractingInwardOrderScrapItem(params.id);
  const updateMutation = useUpdateSubcontractingInwardOrderScrapItem();

  const handleSubmit = (formData: Partial<SubcontractingInwardOrderScrapItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subcontracting-inward-order-scrap-item") },
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
      <Button variant="ghost" onClick={() => router.push("/subcontracting-inward-order-scrap-item")}>← Back</Button>
      <SubcontractingInwardOrderScrapItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}