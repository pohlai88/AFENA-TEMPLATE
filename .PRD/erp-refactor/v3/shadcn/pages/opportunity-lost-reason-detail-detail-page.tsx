"use client";

// Detail page for Opportunity Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpportunityLostReasonDetail, useUpdateOpportunityLostReasonDetail } from "../hooks/opportunity-lost-reason-detail.hooks.js";
import { OpportunityLostReasonDetailForm } from "../forms/opportunity-lost-reason-detail-form.js";
import type { OpportunityLostReasonDetail } from "../types/opportunity-lost-reason-detail.js";
import { Button } from "@/components/ui/button";

export function OpportunityLostReasonDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpportunityLostReasonDetail(params.id);
  const updateMutation = useUpdateOpportunityLostReasonDetail();

  const handleSubmit = (formData: Partial<OpportunityLostReasonDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opportunity-lost-reason-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/opportunity-lost-reason-detail")}>← Back</Button>
      <OpportunityLostReasonDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}