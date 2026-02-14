"use client";

// Detail page for Selling Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSellingSettings, useUpdateSellingSettings } from "../hooks/selling-settings.hooks.js";
import { SellingSettingsForm } from "../forms/selling-settings-form.js";
import type { SellingSettings } from "../types/selling-settings.js";
import { Button } from "@/components/ui/button";

export function SellingSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSellingSettings(params.id);
  const updateMutation = useUpdateSellingSettings();

  const handleSubmit = (formData: Partial<SellingSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/selling-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/selling-settings")}>← Back</Button>
      <SellingSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}