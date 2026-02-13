"use client";

// Detail page for Item Variant Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemVariantSettings, useUpdateItemVariantSettings } from "../hooks/item-variant-settings.hooks.js";
import { ItemVariantSettingsForm } from "../forms/item-variant-settings-form.js";
import type { ItemVariantSettings } from "../types/item-variant-settings.js";
import { Button } from "@/components/ui/button";

export function ItemVariantSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemVariantSettings(params.id);
  const updateMutation = useUpdateItemVariantSettings();

  const handleSubmit = (formData: Partial<ItemVariantSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-variant-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/item-variant-settings")}>← Back</Button>
      <ItemVariantSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}