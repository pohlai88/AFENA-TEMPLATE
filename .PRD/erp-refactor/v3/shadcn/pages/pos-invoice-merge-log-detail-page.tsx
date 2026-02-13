"use client";

// Detail page for POS Invoice Merge Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosInvoiceMergeLog, useUpdatePosInvoiceMergeLog } from "../hooks/pos-invoice-merge-log.hooks.js";
import { PosInvoiceMergeLogForm } from "../forms/pos-invoice-merge-log-form.js";
import type { PosInvoiceMergeLog } from "../types/pos-invoice-merge-log.js";
import { Button } from "@/components/ui/button";

export function PosInvoiceMergeLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosInvoiceMergeLog(params.id);
  const updateMutation = useUpdatePosInvoiceMergeLog();

  const handleSubmit = (formData: Partial<PosInvoiceMergeLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-invoice-merge-log") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-invoice-merge-log")}>← Back</Button>
      <PosInvoiceMergeLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}