"use client";

// Detail page for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankReconciliationTool, useUpdateBankReconciliationTool } from "../hooks/bank-reconciliation-tool.hooks.js";
import { BankReconciliationToolForm } from "../forms/bank-reconciliation-tool-form.js";
import type { BankReconciliationTool } from "../types/bank-reconciliation-tool.js";
import { Button } from "@/components/ui/button";

export function BankReconciliationToolDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankReconciliationTool(params.id);
  const updateMutation = useUpdateBankReconciliationTool();

  const handleSubmit = (formData: Partial<BankReconciliationTool>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-reconciliation-tool") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-reconciliation-tool")}>← Back</Button>
      <BankReconciliationToolForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}