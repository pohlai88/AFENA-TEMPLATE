"use client";

// Detail page for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTransactionDeletionRecordToDelete, useUpdateTransactionDeletionRecordToDelete } from "../hooks/transaction-deletion-record-to-delete.hooks.js";
import { TransactionDeletionRecordToDeleteForm } from "../forms/transaction-deletion-record-to-delete-form.js";
import type { TransactionDeletionRecordToDelete } from "../types/transaction-deletion-record-to-delete.js";
import { Button } from "@/components/ui/button";

export function TransactionDeletionRecordToDeleteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTransactionDeletionRecordToDelete(params.id);
  const updateMutation = useUpdateTransactionDeletionRecordToDelete();

  const handleSubmit = (formData: Partial<TransactionDeletionRecordToDelete>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/transaction-deletion-record-to-delete") },
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
      <Button variant="ghost" onClick={() => router.push("/transaction-deletion-record-to-delete")}>← Back</Button>
      <TransactionDeletionRecordToDeleteForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}