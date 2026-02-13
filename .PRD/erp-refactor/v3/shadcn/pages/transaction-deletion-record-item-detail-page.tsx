"use client";

// Detail page for Transaction Deletion Record Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTransactionDeletionRecordItem, useUpdateTransactionDeletionRecordItem } from "../hooks/transaction-deletion-record-item.hooks.js";
import { TransactionDeletionRecordItemForm } from "../forms/transaction-deletion-record-item-form.js";
import type { TransactionDeletionRecordItem } from "../types/transaction-deletion-record-item.js";
import { Button } from "@/components/ui/button";

export function TransactionDeletionRecordItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTransactionDeletionRecordItem(params.id);
  const updateMutation = useUpdateTransactionDeletionRecordItem();

  const handleSubmit = (formData: Partial<TransactionDeletionRecordItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/transaction-deletion-record-item") },
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
      <Button variant="ghost" onClick={() => router.push("/transaction-deletion-record-item")}>← Back</Button>
      <TransactionDeletionRecordItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}