"use client";

// Detail page for BOM Scrap Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomScrapItem, useUpdateBomScrapItem } from "../hooks/bom-scrap-item.hooks.js";
import { BomScrapItemForm } from "../forms/bom-scrap-item-form.js";
import type { BomScrapItem } from "../types/bom-scrap-item.js";
import { Button } from "@/components/ui/button";

export function BomScrapItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomScrapItem(params.id);
  const updateMutation = useUpdateBomScrapItem();

  const handleSubmit = (formData: Partial<BomScrapItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-scrap-item") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-scrap-item")}>← Back</Button>
      <BomScrapItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}