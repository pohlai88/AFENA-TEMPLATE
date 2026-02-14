"use client";

// Detail page for PSOA Cost Center
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePsoaCostCenter, useUpdatePsoaCostCenter } from "../hooks/psoa-cost-center.hooks.js";
import { PsoaCostCenterForm } from "../forms/psoa-cost-center-form.js";
import type { PsoaCostCenter } from "../types/psoa-cost-center.js";
import { Button } from "@/components/ui/button";

export function PsoaCostCenterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePsoaCostCenter(params.id);
  const updateMutation = useUpdatePsoaCostCenter();

  const handleSubmit = (formData: Partial<PsoaCostCenter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/psoa-cost-center") },
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
      <Button variant="ghost" onClick={() => router.push("/psoa-cost-center")}>← Back</Button>
      <PsoaCostCenterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}