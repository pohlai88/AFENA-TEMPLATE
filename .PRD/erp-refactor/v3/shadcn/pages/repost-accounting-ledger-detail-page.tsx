"use client";

// Detail page for Repost Accounting Ledger
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostAccountingLedger, useUpdateRepostAccountingLedger } from "../hooks/repost-accounting-ledger.hooks.js";
import { RepostAccountingLedgerForm } from "../forms/repost-accounting-ledger-form.js";
import type { RepostAccountingLedger } from "../types/repost-accounting-ledger.js";
import { Button } from "@/components/ui/button";

export function RepostAccountingLedgerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostAccountingLedger(params.id);
  const updateMutation = useUpdateRepostAccountingLedger();

  const handleSubmit = (formData: Partial<RepostAccountingLedger>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-accounting-ledger") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-accounting-ledger")}>← Back</Button>
      <RepostAccountingLedgerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}