"use client";

// Detail page for Territory Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTerritoryItem, useUpdateTerritoryItem } from "../hooks/territory-item.hooks.js";
import { TerritoryItemForm } from "../forms/territory-item-form.js";
import type { TerritoryItem } from "../types/territory-item.js";
import { Button } from "@/components/ui/button";

export function TerritoryItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTerritoryItem(params.id);
  const updateMutation = useUpdateTerritoryItem();

  const handleSubmit = (formData: Partial<TerritoryItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/territory-item") },
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
      <Button variant="ghost" onClick={() => router.push("/territory-item")}>← Back</Button>
      <TerritoryItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}