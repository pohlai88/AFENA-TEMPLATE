"use client";

// Detail page for Quality Inspection Parameter Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityInspectionParameterGroup, useUpdateQualityInspectionParameterGroup } from "../hooks/quality-inspection-parameter-group.hooks.js";
import { QualityInspectionParameterGroupForm } from "../forms/quality-inspection-parameter-group-form.js";
import type { QualityInspectionParameterGroup } from "../types/quality-inspection-parameter-group.js";
import { Button } from "@/components/ui/button";

export function QualityInspectionParameterGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityInspectionParameterGroup(params.id);
  const updateMutation = useUpdateQualityInspectionParameterGroup();

  const handleSubmit = (formData: Partial<QualityInspectionParameterGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-inspection-parameter-group") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-inspection-parameter-group")}>← Back</Button>
      <QualityInspectionParameterGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}