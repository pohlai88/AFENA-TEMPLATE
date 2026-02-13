"use client";

// Detail page for Quality Procedure
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityProcedure, useUpdateQualityProcedure } from "../hooks/quality-procedure.hooks.js";
import { QualityProcedureForm } from "../forms/quality-procedure-form.js";
import type { QualityProcedure } from "../types/quality-procedure.js";
import { Button } from "@/components/ui/button";

export function QualityProcedureDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityProcedure(params.id);
  const updateMutation = useUpdateQualityProcedure();

  const handleSubmit = (formData: Partial<QualityProcedure>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-procedure") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-procedure")}>← Back</Button>
      <QualityProcedureForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}