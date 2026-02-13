"use client";

// Detail page for Bulk Transaction Log
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBulkTransactionLog, useUpdateBulkTransactionLog } from "../hooks/bulk-transaction-log.hooks.js";
import { BulkTransactionLogForm } from "../forms/bulk-transaction-log-form.js";
import type { BulkTransactionLog } from "../types/bulk-transaction-log.js";
import { Button } from "@/components/ui/button";

export function BulkTransactionLogDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBulkTransactionLog(params.id);
  const updateMutation = useUpdateBulkTransactionLog();

  const handleSubmit = (formData: Partial<BulkTransactionLog>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bulk-transaction-log") },
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
      <Button variant="ghost" onClick={() => router.push("/bulk-transaction-log")}>← Back</Button>
      <BulkTransactionLogForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}