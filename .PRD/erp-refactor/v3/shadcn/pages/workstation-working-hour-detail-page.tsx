"use client";

// Detail page for Workstation Working Hour
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkstationWorkingHour, useUpdateWorkstationWorkingHour } from "../hooks/workstation-working-hour.hooks.js";
import { WorkstationWorkingHourForm } from "../forms/workstation-working-hour-form.js";
import type { WorkstationWorkingHour } from "../types/workstation-working-hour.js";
import { Button } from "@/components/ui/button";

export function WorkstationWorkingHourDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkstationWorkingHour(params.id);
  const updateMutation = useUpdateWorkstationWorkingHour();

  const handleSubmit = (formData: Partial<WorkstationWorkingHour>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/workstation-working-hour") },
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
      <Button variant="ghost" onClick={() => router.push("/workstation-working-hour")}>← Back</Button>
      <WorkstationWorkingHourForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}