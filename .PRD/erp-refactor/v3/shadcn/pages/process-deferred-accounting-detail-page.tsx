"use client";

// Detail page for Process Deferred Accounting
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessDeferredAccounting, useUpdateProcessDeferredAccounting } from "../hooks/process-deferred-accounting.hooks.js";
import { ProcessDeferredAccountingForm } from "../forms/process-deferred-accounting-form.js";
import type { ProcessDeferredAccounting } from "../types/process-deferred-accounting.js";
import { Button } from "@/components/ui/button";

export function ProcessDeferredAccountingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessDeferredAccounting(params.id);
  const updateMutation = useUpdateProcessDeferredAccounting();

  const handleSubmit = (formData: Partial<ProcessDeferredAccounting>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-deferred-accounting") },
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
      <Button variant="ghost" onClick={() => router.push("/process-deferred-accounting")}>← Back</Button>
      <ProcessDeferredAccountingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}