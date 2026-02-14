"use client";

// Detail page for Repost Payment Ledger
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostPaymentLedger, useUpdateRepostPaymentLedger } from "../hooks/repost-payment-ledger.hooks.js";
import { RepostPaymentLedgerForm } from "../forms/repost-payment-ledger-form.js";
import type { RepostPaymentLedger } from "../types/repost-payment-ledger.js";
import { Button } from "@/components/ui/button";

export function RepostPaymentLedgerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostPaymentLedger(params.id);
  const updateMutation = useUpdateRepostPaymentLedger();

  const handleSubmit = (formData: Partial<RepostPaymentLedger>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-payment-ledger") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-payment-ledger")}>← Back</Button>
      <RepostPaymentLedgerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}