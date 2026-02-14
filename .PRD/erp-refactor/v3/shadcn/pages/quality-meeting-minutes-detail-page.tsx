"use client";

// Detail page for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityMeetingMinutes, useUpdateQualityMeetingMinutes } from "../hooks/quality-meeting-minutes.hooks.js";
import { QualityMeetingMinutesForm } from "../forms/quality-meeting-minutes-form.js";
import type { QualityMeetingMinutes } from "../types/quality-meeting-minutes.js";
import { Button } from "@/components/ui/button";

export function QualityMeetingMinutesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityMeetingMinutes(params.id);
  const updateMutation = useUpdateQualityMeetingMinutes();

  const handleSubmit = (formData: Partial<QualityMeetingMinutes>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-meeting-minutes") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-meeting-minutes")}>← Back</Button>
      <QualityMeetingMinutesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}