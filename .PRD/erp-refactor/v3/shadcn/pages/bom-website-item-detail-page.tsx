"use client";

// Detail page for BOM Website Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomWebsiteItem, useUpdateBomWebsiteItem } from "../hooks/bom-website-item.hooks.js";
import { BomWebsiteItemForm } from "../forms/bom-website-item-form.js";
import type { BomWebsiteItem } from "../types/bom-website-item.js";
import { Button } from "@/components/ui/button";

export function BomWebsiteItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomWebsiteItem(params.id);
  const updateMutation = useUpdateBomWebsiteItem();

  const handleSubmit = (formData: Partial<BomWebsiteItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-website-item") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-website-item")}>← Back</Button>
      <BomWebsiteItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}