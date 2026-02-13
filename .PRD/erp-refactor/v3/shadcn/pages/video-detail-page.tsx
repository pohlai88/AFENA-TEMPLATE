"use client";

// Detail page for Video
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useVideo, useUpdateVideo } from "../hooks/video.hooks.js";
import { VideoForm } from "../forms/video-form.js";
import type { Video } from "../types/video.js";
import { Button } from "@/components/ui/button";

export function VideoDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useVideo(params.id);
  const updateMutation = useUpdateVideo();

  const handleSubmit = (formData: Partial<Video>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/video") },
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
      <Button variant="ghost" onClick={() => router.push("/video")}>← Back</Button>
      <VideoForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}