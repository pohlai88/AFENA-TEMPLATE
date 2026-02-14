"use client";

// Detail page for Video Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useVideoSettings, useUpdateVideoSettings } from "../hooks/video-settings.hooks.js";
import { VideoSettingsForm } from "../forms/video-settings-form.js";
import type { VideoSettings } from "../types/video-settings.js";
import { Button } from "@/components/ui/button";

export function VideoSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useVideoSettings(params.id);
  const updateMutation = useUpdateVideoSettings();

  const handleSubmit = (formData: Partial<VideoSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/video-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/video-settings")}>← Back</Button>
      <VideoSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}