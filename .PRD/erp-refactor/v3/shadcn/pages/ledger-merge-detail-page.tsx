"use client";

// Detail page for Ledger Merge
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLedgerMerge, useUpdateLedgerMerge } from "../hooks/ledger-merge.hooks.js";
import { LedgerMergeForm } from "../forms/ledger-merge-form.js";
import type { LedgerMerge } from "../types/ledger-merge.js";
import { Button } from "@/components/ui/button";

export function LedgerMergeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLedgerMerge(params.id);
  const updateMutation = useUpdateLedgerMerge();

  const handleSubmit = (formData: Partial<LedgerMerge>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/ledger-merge") },
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
      <Button variant="ghost" onClick={() => router.push("/ledger-merge")}>← Back</Button>
      <LedgerMergeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}