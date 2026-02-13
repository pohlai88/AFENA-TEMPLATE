"use client";

// Detail page for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityMeetingAgenda, useUpdateQualityMeetingAgenda } from "../hooks/quality-meeting-agenda.hooks.js";
import { QualityMeetingAgendaForm } from "../forms/quality-meeting-agenda-form.js";
import type { QualityMeetingAgenda } from "../types/quality-meeting-agenda.js";
import { Button } from "@/components/ui/button";

export function QualityMeetingAgendaDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityMeetingAgenda(params.id);
  const updateMutation = useUpdateQualityMeetingAgenda();

  const handleSubmit = (formData: Partial<QualityMeetingAgenda>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-meeting-agenda") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-meeting-agenda")}>← Back</Button>
      <QualityMeetingAgendaForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}