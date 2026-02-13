"use client";

// Detail page for Activity Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useActivityType, useUpdateActivityType } from "../hooks/activity-type.hooks.js";
import { ActivityTypeForm } from "../forms/activity-type-form.js";
import type { ActivityType } from "../types/activity-type.js";
import { Button } from "@/components/ui/button";

export function ActivityTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useActivityType(params.id);
  const updateMutation = useUpdateActivityType();

  const handleSubmit = (formData: Partial<ActivityType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/activity-type") },
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
      <Button variant="ghost" onClick={() => router.push("/activity-type")}>← Back</Button>
      <ActivityTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}