"use client";

// Detail page for South Africa VAT Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSouthAfricaVatSettings, useUpdateSouthAfricaVatSettings } from "../hooks/south-africa-vat-settings.hooks.js";
import { SouthAfricaVatSettingsForm } from "../forms/south-africa-vat-settings-form.js";
import type { SouthAfricaVatSettings } from "../types/south-africa-vat-settings.js";
import { Button } from "@/components/ui/button";

export function SouthAfricaVatSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSouthAfricaVatSettings(params.id);
  const updateMutation = useUpdateSouthAfricaVatSettings();

  const handleSubmit = (formData: Partial<SouthAfricaVatSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/south-africa-vat-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/south-africa-vat-settings")}>← Back</Button>
      <SouthAfricaVatSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}