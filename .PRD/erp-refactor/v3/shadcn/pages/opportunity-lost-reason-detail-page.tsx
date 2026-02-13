"use client";

// Detail page for Opportunity Lost Reason
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpportunityLostReason, useUpdateOpportunityLostReason } from "../hooks/opportunity-lost-reason.hooks.js";
import { OpportunityLostReasonForm } from "../forms/opportunity-lost-reason-form.js";
import type { OpportunityLostReason } from "../types/opportunity-lost-reason.js";
import { Button } from "@/components/ui/button";

export function OpportunityLostReasonDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpportunityLostReason(params.id);
  const updateMutation = useUpdateOpportunityLostReason();

  const handleSubmit = (formData: Partial<OpportunityLostReason>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opportunity-lost-reason") },
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
      <Button variant="ghost" onClick={() => router.push("/opportunity-lost-reason")}>← Back</Button>
      <OpportunityLostReasonForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}