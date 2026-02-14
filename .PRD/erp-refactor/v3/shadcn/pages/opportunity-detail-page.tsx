"use client";

// Detail page for Opportunity
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpportunity, useUpdateOpportunity } from "../hooks/opportunity.hooks.js";
import { OpportunityForm } from "../forms/opportunity-form.js";
import type { Opportunity } from "../types/opportunity.js";
import { Button } from "@/components/ui/button";

export function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpportunity(params.id);
  const updateMutation = useUpdateOpportunity();

  const handleSubmit = (formData: Partial<Opportunity>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opportunity") },
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
      <Button variant="ghost" onClick={() => router.push("/opportunity")}>← Back</Button>
      <OpportunityForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}