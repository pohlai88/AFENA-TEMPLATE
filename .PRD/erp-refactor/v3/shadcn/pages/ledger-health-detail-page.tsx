"use client";

// Detail page for Ledger Health
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLedgerHealth, useUpdateLedgerHealth } from "../hooks/ledger-health.hooks.js";
import { LedgerHealthForm } from "../forms/ledger-health-form.js";
import type { LedgerHealth } from "../types/ledger-health.js";
import { Button } from "@/components/ui/button";

export function LedgerHealthDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLedgerHealth(params.id);
  const updateMutation = useUpdateLedgerHealth();

  const handleSubmit = (formData: Partial<LedgerHealth>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/ledger-health") },
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
      <Button variant="ghost" onClick={() => router.push("/ledger-health")}>← Back</Button>
      <LedgerHealthForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}