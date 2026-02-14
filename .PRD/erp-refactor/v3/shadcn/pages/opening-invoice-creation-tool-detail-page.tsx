"use client";

// Detail page for Opening Invoice Creation Tool
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpeningInvoiceCreationTool, useUpdateOpeningInvoiceCreationTool } from "../hooks/opening-invoice-creation-tool.hooks.js";
import { OpeningInvoiceCreationToolForm } from "../forms/opening-invoice-creation-tool-form.js";
import type { OpeningInvoiceCreationTool } from "../types/opening-invoice-creation-tool.js";
import { Button } from "@/components/ui/button";

export function OpeningInvoiceCreationToolDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpeningInvoiceCreationTool(params.id);
  const updateMutation = useUpdateOpeningInvoiceCreationTool();

  const handleSubmit = (formData: Partial<OpeningInvoiceCreationTool>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opening-invoice-creation-tool") },
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
      <Button variant="ghost" onClick={() => router.push("/opening-invoice-creation-tool")}>← Back</Button>
      <OpeningInvoiceCreationToolForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}