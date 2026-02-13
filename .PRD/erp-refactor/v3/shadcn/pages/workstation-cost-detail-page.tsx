"use client";

// Detail page for Workstation Cost
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkstationCost, useUpdateWorkstationCost } from "../hooks/workstation-cost.hooks.js";
import { WorkstationCostForm } from "../forms/workstation-cost-form.js";
import type { WorkstationCost } from "../types/workstation-cost.js";
import { Button } from "@/components/ui/button";

export function WorkstationCostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkstationCost(params.id);
  const updateMutation = useUpdateWorkstationCost();

  const handleSubmit = (formData: Partial<WorkstationCost>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/workstation-cost") },
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
      <Button variant="ghost" onClick={() => router.push("/workstation-cost")}>← Back</Button>
      <WorkstationCostForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}