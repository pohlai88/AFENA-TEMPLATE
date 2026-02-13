"use client";

// Detail page for Quality Procedure Process
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityProcedureProcess, useUpdateQualityProcedureProcess } from "../hooks/quality-procedure-process.hooks.js";
import { QualityProcedureProcessForm } from "../forms/quality-procedure-process-form.js";
import type { QualityProcedureProcess } from "../types/quality-procedure-process.js";
import { Button } from "@/components/ui/button";

export function QualityProcedureProcessDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityProcedureProcess(params.id);
  const updateMutation = useUpdateQualityProcedureProcess();

  const handleSubmit = (formData: Partial<QualityProcedureProcess>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-procedure-process") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-procedure-process")}>← Back</Button>
      <QualityProcedureProcessForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}