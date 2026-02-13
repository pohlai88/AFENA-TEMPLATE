"use client";

// Detail page for Service Level Priority
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useServiceLevelPriority, useUpdateServiceLevelPriority } from "../hooks/service-level-priority.hooks.js";
import { ServiceLevelPriorityForm } from "../forms/service-level-priority-form.js";
import type { ServiceLevelPriority } from "../types/service-level-priority.js";
import { Button } from "@/components/ui/button";

export function ServiceLevelPriorityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useServiceLevelPriority(params.id);
  const updateMutation = useUpdateServiceLevelPriority();

  const handleSubmit = (formData: Partial<ServiceLevelPriority>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/service-level-priority") },
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
      <Button variant="ghost" onClick={() => router.push("/service-level-priority")}>← Back</Button>
      <ServiceLevelPriorityForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}