"use client";

// Detail page for Repost Accounting Ledger Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostAccountingLedgerSettings, useUpdateRepostAccountingLedgerSettings } from "../hooks/repost-accounting-ledger-settings.hooks.js";
import { RepostAccountingLedgerSettingsForm } from "../forms/repost-accounting-ledger-settings-form.js";
import type { RepostAccountingLedgerSettings } from "../types/repost-accounting-ledger-settings.js";
import { Button } from "@/components/ui/button";

export function RepostAccountingLedgerSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostAccountingLedgerSettings(params.id);
  const updateMutation = useUpdateRepostAccountingLedgerSettings();

  const handleSubmit = (formData: Partial<RepostAccountingLedgerSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-accounting-ledger-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-accounting-ledger-settings")}>← Back</Button>
      <RepostAccountingLedgerSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}