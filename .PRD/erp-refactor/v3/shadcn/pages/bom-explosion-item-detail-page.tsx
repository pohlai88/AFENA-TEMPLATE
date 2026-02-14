"use client";

// Detail page for BOM Explosion Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomExplosionItem, useUpdateBomExplosionItem } from "../hooks/bom-explosion-item.hooks.js";
import { BomExplosionItemForm } from "../forms/bom-explosion-item-form.js";
import type { BomExplosionItem } from "../types/bom-explosion-item.js";
import { Button } from "@/components/ui/button";

export function BomExplosionItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomExplosionItem(params.id);
  const updateMutation = useUpdateBomExplosionItem();

  const handleSubmit = (formData: Partial<BomExplosionItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-explosion-item") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-explosion-item")}>← Back</Button>
      <BomExplosionItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}