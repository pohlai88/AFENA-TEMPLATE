"use client";

// Detail page for Pause SLA On Status
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePauseSlaOnStatus, useUpdatePauseSlaOnStatus } from "../hooks/pause-sla-on-status.hooks.js";
import { PauseSlaOnStatusForm } from "../forms/pause-sla-on-status-form.js";
import type { PauseSlaOnStatus } from "../types/pause-sla-on-status.js";
import { Button } from "@/components/ui/button";

export function PauseSlaOnStatusDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePauseSlaOnStatus(params.id);
  const updateMutation = useUpdatePauseSlaOnStatus();

  const handleSubmit = (formData: Partial<PauseSlaOnStatus>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pause-sla-on-status") },
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
      <Button variant="ghost" onClick={() => router.push("/pause-sla-on-status")}>← Back</Button>
      <PauseSlaOnStatusForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}