"use client";

// Detail page for Quality Meeting
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityMeeting, useUpdateQualityMeeting } from "../hooks/quality-meeting.hooks.js";
import { QualityMeetingForm } from "../forms/quality-meeting-form.js";
import type { QualityMeeting } from "../types/quality-meeting.js";
import { Button } from "@/components/ui/button";

export function QualityMeetingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityMeeting(params.id);
  const updateMutation = useUpdateQualityMeeting();

  const handleSubmit = (formData: Partial<QualityMeeting>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-meeting") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-meeting")}>← Back</Button>
      <QualityMeetingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}