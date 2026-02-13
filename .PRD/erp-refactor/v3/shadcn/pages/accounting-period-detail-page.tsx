"use client";

// Detail page for Accounting Period
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountingPeriod, useUpdateAccountingPeriod } from "../hooks/accounting-period.hooks.js";
import { AccountingPeriodForm } from "../forms/accounting-period-form.js";
import type { AccountingPeriod } from "../types/accounting-period.js";
import { Button } from "@/components/ui/button";

export function AccountingPeriodDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountingPeriod(params.id);
  const updateMutation = useUpdateAccountingPeriod();

  const handleSubmit = (formData: Partial<AccountingPeriod>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/accounting-period") },
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
      <Button variant="ghost" onClick={() => router.push("/accounting-period")}>← Back</Button>
      <AccountingPeriodForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}