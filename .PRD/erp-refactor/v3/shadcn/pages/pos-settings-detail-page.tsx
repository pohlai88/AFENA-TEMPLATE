"use client";

// Detail page for POS Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosSettings, useUpdatePosSettings } from "../hooks/pos-settings.hooks.js";
import { PosSettingsForm } from "../forms/pos-settings-form.js";
import type { PosSettings } from "../types/pos-settings.js";
import { Button } from "@/components/ui/button";

export function PosSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosSettings(params.id);
  const updateMutation = useUpdatePosSettings();

  const handleSubmit = (formData: Partial<PosSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-settings")}>← Back</Button>
      <PosSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}