"use client";

// Detail page for Manufacturing Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useManufacturingSettings, useUpdateManufacturingSettings } from "../hooks/manufacturing-settings.hooks.js";
import { ManufacturingSettingsForm } from "../forms/manufacturing-settings-form.js";
import type { ManufacturingSettings } from "../types/manufacturing-settings.js";
import { Button } from "@/components/ui/button";

export function ManufacturingSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useManufacturingSettings(params.id);
  const updateMutation = useUpdateManufacturingSettings();

  const handleSubmit = (formData: Partial<ManufacturingSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/manufacturing-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/manufacturing-settings")}>← Back</Button>
      <ManufacturingSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}