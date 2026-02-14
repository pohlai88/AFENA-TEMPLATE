"use client";

// Detail page for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostAccountingLedgerItems, useUpdateRepostAccountingLedgerItems } from "../hooks/repost-accounting-ledger-items.hooks.js";
import { RepostAccountingLedgerItemsForm } from "../forms/repost-accounting-ledger-items-form.js";
import type { RepostAccountingLedgerItems } from "../types/repost-accounting-ledger-items.js";
import { Button } from "@/components/ui/button";

export function RepostAccountingLedgerItemsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostAccountingLedgerItems(params.id);
  const updateMutation = useUpdateRepostAccountingLedgerItems();

  const handleSubmit = (formData: Partial<RepostAccountingLedgerItems>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-accounting-ledger-items") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-accounting-ledger-items")}>← Back</Button>
      <RepostAccountingLedgerItemsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}