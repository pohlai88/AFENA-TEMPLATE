"use client";

// Detail page for Landed Cost Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLandedCostItem, useUpdateLandedCostItem } from "../hooks/landed-cost-item.hooks.js";
import { LandedCostItemForm } from "../forms/landed-cost-item-form.js";
import type { LandedCostItem } from "../types/landed-cost-item.js";
import { Button } from "@/components/ui/button";

export function LandedCostItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLandedCostItem(params.id);
  const updateMutation = useUpdateLandedCostItem();

  const handleSubmit = (formData: Partial<LandedCostItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/landed-cost-item") },
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
      <Button variant="ghost" onClick={() => router.push("/landed-cost-item")}>← Back</Button>
      <LandedCostItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}