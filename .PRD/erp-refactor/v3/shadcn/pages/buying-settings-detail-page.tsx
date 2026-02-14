"use client";

// Detail page for Buying Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBuyingSettings, useUpdateBuyingSettings } from "../hooks/buying-settings.hooks.js";
import { BuyingSettingsForm } from "../forms/buying-settings-form.js";
import type { BuyingSettings } from "../types/buying-settings.js";
import { Button } from "@/components/ui/button";

export function BuyingSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBuyingSettings(params.id);
  const updateMutation = useUpdateBuyingSettings();

  const handleSubmit = (formData: Partial<BuyingSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/buying-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/buying-settings")}>← Back</Button>
      <BuyingSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}