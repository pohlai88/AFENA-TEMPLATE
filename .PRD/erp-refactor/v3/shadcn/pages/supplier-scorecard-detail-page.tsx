"use client";

// Detail page for Supplier Scorecard
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierScorecard, useUpdateSupplierScorecard } from "../hooks/supplier-scorecard.hooks.js";
import { SupplierScorecardForm } from "../forms/supplier-scorecard-form.js";
import type { SupplierScorecard } from "../types/supplier-scorecard.js";
import { Button } from "@/components/ui/button";

export function SupplierScorecardDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierScorecard(params.id);
  const updateMutation = useUpdateSupplierScorecard();

  const handleSubmit = (formData: Partial<SupplierScorecard>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-scorecard") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-scorecard")}>← Back</Button>
      <SupplierScorecardForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}