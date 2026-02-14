"use client";

// Detail page for Non Conformance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useNonConformance, useUpdateNonConformance } from "../hooks/non-conformance.hooks.js";
import { NonConformanceForm } from "../forms/non-conformance-form.js";
import type { NonConformance } from "../types/non-conformance.js";
import { Button } from "@/components/ui/button";

export function NonConformanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useNonConformance(params.id);
  const updateMutation = useUpdateNonConformance();

  const handleSubmit = (formData: Partial<NonConformance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/non-conformance") },
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
      <Button variant="ghost" onClick={() => router.push("/non-conformance")}>← Back</Button>
      <NonConformanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}