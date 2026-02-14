"use client";

// Detail page for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBulkTransactionLogDetail, useUpdateBulkTransactionLogDetail } from "../hooks/bulk-transaction-log-detail.hooks.js";
import { BulkTransactionLogDetailForm } from "../forms/bulk-transaction-log-detail-form.js";
import type { BulkTransactionLogDetail } from "../types/bulk-transaction-log-detail.js";
import { Button } from "@/components/ui/button";

export function BulkTransactionLogDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBulkTransactionLogDetail(params.id);
  const updateMutation = useUpdateBulkTransactionLogDetail();

  const handleSubmit = (formData: Partial<BulkTransactionLogDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bulk-transaction-log-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/bulk-transaction-log-detail")}>← Back</Button>
      <BulkTransactionLogDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}