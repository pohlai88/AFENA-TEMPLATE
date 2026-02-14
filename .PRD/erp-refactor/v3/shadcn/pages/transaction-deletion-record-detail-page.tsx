"use client";

// Detail page for Transaction Deletion Record
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTransactionDeletionRecord, useUpdateTransactionDeletionRecord } from "../hooks/transaction-deletion-record.hooks.js";
import { TransactionDeletionRecordForm } from "../forms/transaction-deletion-record-form.js";
import type { TransactionDeletionRecord } from "../types/transaction-deletion-record.js";
import { Button } from "@/components/ui/button";

export function TransactionDeletionRecordDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTransactionDeletionRecord(params.id);
  const updateMutation = useUpdateTransactionDeletionRecord();

  const handleSubmit = (formData: Partial<TransactionDeletionRecord>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/transaction-deletion-record") },
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
      <Button variant="ghost" onClick={() => router.push("/transaction-deletion-record")}>← Back</Button>
      <TransactionDeletionRecordForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}