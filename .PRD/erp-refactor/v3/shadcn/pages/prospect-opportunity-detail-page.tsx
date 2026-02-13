"use client";

// Detail page for Prospect Opportunity
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProspectOpportunity, useUpdateProspectOpportunity } from "../hooks/prospect-opportunity.hooks.js";
import { ProspectOpportunityForm } from "../forms/prospect-opportunity-form.js";
import type { ProspectOpportunity } from "../types/prospect-opportunity.js";
import { Button } from "@/components/ui/button";

export function ProspectOpportunityDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProspectOpportunity(params.id);
  const updateMutation = useUpdateProspectOpportunity();

  const handleSubmit = (formData: Partial<ProspectOpportunity>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/prospect-opportunity") },
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
      <Button variant="ghost" onClick={() => router.push("/prospect-opportunity")}>← Back</Button>
      <ProspectOpportunityForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}