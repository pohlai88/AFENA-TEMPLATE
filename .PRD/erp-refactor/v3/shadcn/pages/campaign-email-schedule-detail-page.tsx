"use client";

// Detail page for Campaign Email Schedule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCampaignEmailSchedule, useUpdateCampaignEmailSchedule } from "../hooks/campaign-email-schedule.hooks.js";
import { CampaignEmailScheduleForm } from "../forms/campaign-email-schedule-form.js";
import type { CampaignEmailSchedule } from "../types/campaign-email-schedule.js";
import { Button } from "@/components/ui/button";

export function CampaignEmailScheduleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCampaignEmailSchedule(params.id);
  const updateMutation = useUpdateCampaignEmailSchedule();

  const handleSubmit = (formData: Partial<CampaignEmailSchedule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/campaign-email-schedule") },
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
      <Button variant="ghost" onClick={() => router.push("/campaign-email-schedule")}>← Back</Button>
      <CampaignEmailScheduleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}