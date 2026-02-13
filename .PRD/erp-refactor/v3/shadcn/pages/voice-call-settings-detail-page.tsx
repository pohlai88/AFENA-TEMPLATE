"use client";

// Detail page for Voice Call Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useVoiceCallSettings, useUpdateVoiceCallSettings } from "../hooks/voice-call-settings.hooks.js";
import { VoiceCallSettingsForm } from "../forms/voice-call-settings-form.js";
import type { VoiceCallSettings } from "../types/voice-call-settings.js";
import { Button } from "@/components/ui/button";

export function VoiceCallSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useVoiceCallSettings(params.id);
  const updateMutation = useUpdateVoiceCallSettings();

  const handleSubmit = (formData: Partial<VoiceCallSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/voice-call-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/voice-call-settings")}>← Back</Button>
      <VoiceCallSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}