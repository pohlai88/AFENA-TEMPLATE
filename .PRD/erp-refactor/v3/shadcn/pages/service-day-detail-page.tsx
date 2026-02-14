"use client";

// Detail page for Service Day
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useServiceDay, useUpdateServiceDay } from "../hooks/service-day.hooks.js";
import { ServiceDayForm } from "../forms/service-day-form.js";
import type { ServiceDay } from "../types/service-day.js";
import { Button } from "@/components/ui/button";

export function ServiceDayDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useServiceDay(params.id);
  const updateMutation = useUpdateServiceDay();

  const handleSubmit = (formData: Partial<ServiceDay>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/service-day") },
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
      <Button variant="ghost" onClick={() => router.push("/service-day")}>← Back</Button>
      <ServiceDayForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}