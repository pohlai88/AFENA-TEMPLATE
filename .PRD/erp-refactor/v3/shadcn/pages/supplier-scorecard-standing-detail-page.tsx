"use client";

// Detail page for Supplier Scorecard Standing
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecardStanding, useUpdateSupplierScorecardStanding } from "../hooks/supplier-scorecard-standing.hooks.js";
import { SupplierScorecardStandingForm } from "../forms/supplier-scorecard-standing-form.js";
import type { SupplierScorecardStanding } from "../types/supplier-scorecard-standing.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardStandingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecardStanding(params.id);
  const updateMutation = useUpdateSupplierScorecardStanding();

  const handleSubmit = (formData: Partial<SupplierScorecardStanding>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard-standing") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard-standing")}>← Back</Button>
      <SupplierScorecardStandingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}