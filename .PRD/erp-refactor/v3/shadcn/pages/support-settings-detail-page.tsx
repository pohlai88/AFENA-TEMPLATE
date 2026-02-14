"use client";

// Detail page for Support Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupportSettings, useUpdateSupportSettings } from "../hooks/support-settings.hooks.js";
import { SupportSettingsForm } from "../forms/support-settings-form.js";
import type { SupportSettings } from "../types/support-settings.js";
import { Button } from "@/components/ui/button";

export function SupportSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupportSettings(params.id);
  const updateMutation = useUpdateSupportSettings();

  const handleSubmit = (formData: Partial<SupportSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/support-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/support-settings")}>← Back</Button>
      <SupportSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}