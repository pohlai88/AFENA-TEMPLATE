"use client";

// Detail page for Ledger Merge Accounts
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLedgerMergeAccounts, useUpdateLedgerMergeAccounts } from "../hooks/ledger-merge-accounts.hooks.js";
import { LedgerMergeAccountsForm } from "../forms/ledger-merge-accounts-form.js";
import type { LedgerMergeAccounts } from "../types/ledger-merge-accounts.js";
import { Button } from "@/components/ui/button";

export function LedgerMergeAccountsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLedgerMergeAccounts(params.id);
  const updateMutation = useUpdateLedgerMergeAccounts();

  const handleSubmit = (formData: Partial<LedgerMergeAccounts>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/ledger-merge-accounts") },
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
      <Button variant="ghost" onClick={() => router.push("/ledger-merge-accounts")}>← Back</Button>
      <LedgerMergeAccountsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}