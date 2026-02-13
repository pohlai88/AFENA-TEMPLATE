"use client";

// Detail page for Ledger Health Monitor Company
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLedgerHealthMonitorCompany, useUpdateLedgerHealthMonitorCompany } from "../hooks/ledger-health-monitor-company.hooks.js";
import { LedgerHealthMonitorCompanyForm } from "../forms/ledger-health-monitor-company-form.js";
import type { LedgerHealthMonitorCompany } from "../types/ledger-health-monitor-company.js";
import { Button } from "@/components/ui/button";

export function LedgerHealthMonitorCompanyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLedgerHealthMonitorCompany(params.id);
  const updateMutation = useUpdateLedgerHealthMonitorCompany();

  const handleSubmit = (formData: Partial<LedgerHealthMonitorCompany>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/ledger-health-monitor-company") },
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
      <Button variant="ghost" onClick={() => router.push("/ledger-health-monitor-company")}>← Back</Button>
      <LedgerHealthMonitorCompanyForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}