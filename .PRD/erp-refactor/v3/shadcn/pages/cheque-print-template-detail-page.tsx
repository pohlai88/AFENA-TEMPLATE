"use client";

// Detail page for Cheque Print Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useChequePrintTemplate, useUpdateChequePrintTemplate } from "../hooks/cheque-print-template.hooks.js";
import { ChequePrintTemplateForm } from "../forms/cheque-print-template-form.js";
import type { ChequePrintTemplate } from "../types/cheque-print-template.js";
import { Button } from "@/components/ui/button";

export function ChequePrintTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useChequePrintTemplate(params.id);
  const updateMutation = useUpdateChequePrintTemplate();

  const handleSubmit = (formData: Partial<ChequePrintTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/cheque-print-template") },
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
      <Button variant="ghost" onClick={() => router.push("/cheque-print-template")}>← Back</Button>
      <ChequePrintTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}