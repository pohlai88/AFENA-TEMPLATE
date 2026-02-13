"use client";

// Detail page for SLA Fulfilled On Status
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSlaFulfilledOnStatus, useUpdateSlaFulfilledOnStatus } from "../hooks/sla-fulfilled-on-status.hooks.js";
import { SlaFulfilledOnStatusForm } from "../forms/sla-fulfilled-on-status-form.js";
import type { SlaFulfilledOnStatus } from "../types/sla-fulfilled-on-status.js";
import { Button } from "@/components/ui/button";

export function SlaFulfilledOnStatusDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSlaFulfilledOnStatus(params.id);
  const updateMutation = useUpdateSlaFulfilledOnStatus();

  const handleSubmit = (formData: Partial<SlaFulfilledOnStatus>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sla-fulfilled-on-status") },
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
      <Button variant="ghost" onClick={() => router.push("/sla-fulfilled-on-status")}>← Back</Button>
      <SlaFulfilledOnStatusForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}