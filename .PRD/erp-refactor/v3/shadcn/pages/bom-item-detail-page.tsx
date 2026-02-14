"use client";

// Detail page for BOM Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomItem, useUpdateBomItem } from "../hooks/bom-item.hooks.js";
import { BomItemForm } from "../forms/bom-item-form.js";
import type { BomItem } from "../types/bom-item.js";
import { Button } from "@/components/ui/button";

export function BomItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomItem(params.id);
  const updateMutation = useUpdateBomItem();

  const handleSubmit = (formData: Partial<BomItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-item") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-item")}>← Back</Button>
      <BomItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}