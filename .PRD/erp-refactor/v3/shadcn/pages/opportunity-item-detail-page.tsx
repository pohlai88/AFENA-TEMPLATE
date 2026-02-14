"use client";

// Detail page for Opportunity Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpportunityItem, useUpdateOpportunityItem } from "../hooks/opportunity-item.hooks.js";
import { OpportunityItemForm } from "../forms/opportunity-item-form.js";
import type { OpportunityItem } from "../types/opportunity-item.js";
import { Button } from "@/components/ui/button";

export function OpportunityItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpportunityItem(params.id);
  const updateMutation = useUpdateOpportunityItem();

  const handleSubmit = (formData: Partial<OpportunityItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opportunity-item") },
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
      <Button variant="ghost" onClick={() => router.push("/opportunity-item")}>← Back</Button>
      <OpportunityItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}