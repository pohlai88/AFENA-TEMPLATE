"use client";

// Detail page for Communication Medium Timeslot
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCommunicationMediumTimeslot, useUpdateCommunicationMediumTimeslot } from "../hooks/communication-medium-timeslot.hooks.js";
import { CommunicationMediumTimeslotForm } from "../forms/communication-medium-timeslot-form.js";
import type { CommunicationMediumTimeslot } from "../types/communication-medium-timeslot.js";
import { Button } from "@/components/ui/button";

export function CommunicationMediumTimeslotDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCommunicationMediumTimeslot(params.id);
  const updateMutation = useUpdateCommunicationMediumTimeslot();

  const handleSubmit = (formData: Partial<CommunicationMediumTimeslot>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/communication-medium-timeslot") },
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
      <Button variant="ghost" onClick={() => router.push("/communication-medium-timeslot")}>← Back</Button>
      <CommunicationMediumTimeslotForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}