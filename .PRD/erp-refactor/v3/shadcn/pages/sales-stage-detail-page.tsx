"use client";

// Detail page for Sales Stage
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesStage, useUpdateSalesStage } from "../hooks/sales-stage.hooks.js";
import { SalesStageForm } from "../forms/sales-stage-form.js";
import type { SalesStage } from "../types/sales-stage.js";
import { Button } from "@/components/ui/button";

export function SalesStageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesStage(params.id);
  const updateMutation = useUpdateSalesStage();

  const handleSubmit = (formData: Partial<SalesStage>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-stage") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-stage")}>← Back</Button>
      <SalesStageForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}