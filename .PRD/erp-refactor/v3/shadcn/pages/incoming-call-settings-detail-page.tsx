"use client";

// Detail page for Incoming Call Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useIncomingCallSettings, useUpdateIncomingCallSettings } from "../hooks/incoming-call-settings.hooks.js";
import { IncomingCallSettingsForm } from "../forms/incoming-call-settings-form.js";
import type { IncomingCallSettings } from "../types/incoming-call-settings.js";
import { Button } from "@/components/ui/button";

export function IncomingCallSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useIncomingCallSettings(params.id);
  const updateMutation = useUpdateIncomingCallSettings();

  const handleSubmit = (formData: Partial<IncomingCallSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/incoming-call-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/incoming-call-settings")}>← Back</Button>
      <IncomingCallSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}