"use client";

// Detail page for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityInspectionParameter, useUpdateQualityInspectionParameter } from "../hooks/quality-inspection-parameter.hooks.js";
import { QualityInspectionParameterForm } from "../forms/quality-inspection-parameter-form.js";
import type { QualityInspectionParameter } from "../types/quality-inspection-parameter.js";
import { Button } from "@/components/ui/button";

export function QualityInspectionParameterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityInspectionParameter(params.id);
  const updateMutation = useUpdateQualityInspectionParameter();

  const handleSubmit = (formData: Partial<QualityInspectionParameter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-inspection-parameter") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-inspection-parameter")}>← Back</Button>
      <QualityInspectionParameterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}