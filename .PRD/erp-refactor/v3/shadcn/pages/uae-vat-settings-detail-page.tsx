"use client";

// Detail page for UAE VAT Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUaeVatSettings, useUpdateUaeVatSettings } from "../hooks/uae-vat-settings.hooks.js";
import { UaeVatSettingsForm } from "../forms/uae-vat-settings-form.js";
import type { UaeVatSettings } from "../types/uae-vat-settings.js";
import { Button } from "@/components/ui/button";

export function UaeVatSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUaeVatSettings(params.id);
  const updateMutation = useUpdateUaeVatSettings();

  const handleSubmit = (formData: Partial<UaeVatSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/uae-vat-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/uae-vat-settings")}>← Back</Button>
      <UaeVatSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}