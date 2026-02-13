"use client";

// Detail page for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTransactionDeletionRecordDetails, useUpdateTransactionDeletionRecordDetails } from "../hooks/transaction-deletion-record-details.hooks.js";
import { TransactionDeletionRecordDetailsForm } from "../forms/transaction-deletion-record-details-form.js";
import type { TransactionDeletionRecordDetails } from "../types/transaction-deletion-record-details.js";
import { Button } from "@/components/ui/button";

export function TransactionDeletionRecordDetailsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTransactionDeletionRecordDetails(params.id);
  const updateMutation = useUpdateTransactionDeletionRecordDetails();

  const handleSubmit = (formData: Partial<TransactionDeletionRecordDetails>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/transaction-deletion-record-details") },
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
      <Button variant="ghost" onClick={() => router.push("/transaction-deletion-record-details")}>← Back</Button>
      <TransactionDeletionRecordDetailsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}