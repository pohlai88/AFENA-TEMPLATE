"use client";

// Detail page for Packing Slip Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePackingSlipItem, useUpdatePackingSlipItem } from "../hooks/packing-slip-item.hooks.js";
import { PackingSlipItemForm } from "../forms/packing-slip-item-form.js";
import type { PackingSlipItem } from "../types/packing-slip-item.js";
import { Button } from "@/components/ui/button";

export function PackingSlipItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePackingSlipItem(params.id);
  const updateMutation = useUpdatePackingSlipItem();

  const handleSubmit = (formData: Partial<PackingSlipItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/packing-slip-item") },
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
      <Button variant="ghost" onClick={() => router.push("/packing-slip-item")}>← Back</Button>
      <PackingSlipItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}