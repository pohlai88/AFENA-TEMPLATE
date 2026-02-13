"use client";

// Detail page for Opportunity Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpportunityType, useUpdateOpportunityType } from "../hooks/opportunity-type.hooks.js";
import { OpportunityTypeForm } from "../forms/opportunity-type-form.js";
import type { OpportunityType } from "../types/opportunity-type.js";
import { Button } from "@/components/ui/button";

export function OpportunityTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpportunityType(params.id);
  const updateMutation = useUpdateOpportunityType();

  const handleSubmit = (formData: Partial<OpportunityType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opportunity-type") },
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
      <Button variant="ghost" onClick={() => router.push("/opportunity-type")}>← Back</Button>
      <OpportunityTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}