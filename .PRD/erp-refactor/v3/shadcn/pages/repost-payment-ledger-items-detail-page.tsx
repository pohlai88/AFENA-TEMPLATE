"use client";

// Detail page for Repost Payment Ledger Items
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostPaymentLedgerItems, useUpdateRepostPaymentLedgerItems } from "../hooks/repost-payment-ledger-items.hooks.js";
import { RepostPaymentLedgerItemsForm } from "../forms/repost-payment-ledger-items-form.js";
import type { RepostPaymentLedgerItems } from "../types/repost-payment-ledger-items.js";
import { Button } from "@/components/ui/button";

export function RepostPaymentLedgerItemsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostPaymentLedgerItems(params.id);
  const updateMutation = useUpdateRepostPaymentLedgerItems();

  const handleSubmit = (formData: Partial<RepostPaymentLedgerItems>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-payment-ledger-items") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-payment-ledger-items")}>← Back</Button>
      <RepostPaymentLedgerItemsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}