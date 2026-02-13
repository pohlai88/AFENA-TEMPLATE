"use client";

// Detail page for Ledger Health Monitor
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLedgerHealthMonitor, useUpdateLedgerHealthMonitor } from "../hooks/ledger-health-monitor.hooks.js";
import { LedgerHealthMonitorForm } from "../forms/ledger-health-monitor-form.js";
import type { LedgerHealthMonitor } from "../types/ledger-health-monitor.js";
import { Button } from "@/components/ui/button";

export function LedgerHealthMonitorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLedgerHealthMonitor(params.id);
  const updateMutation = useUpdateLedgerHealthMonitor();

  const handleSubmit = (formData: Partial<LedgerHealthMonitor>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/ledger-health-monitor") },
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
      <Button variant="ghost" onClick={() => router.push("/ledger-health-monitor")}>← Back</Button>
      <LedgerHealthMonitorForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}