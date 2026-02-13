"use client";

// Detail page for Accounting Dimension Filter
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountingDimensionFilter, useUpdateAccountingDimensionFilter } from "../hooks/accounting-dimension-filter.hooks.js";
import { AccountingDimensionFilterForm } from "../forms/accounting-dimension-filter-form.js";
import type { AccountingDimensionFilter } from "../types/accounting-dimension-filter.js";
import { Button } from "@/components/ui/button";

export function AccountingDimensionFilterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountingDimensionFilter(params.id);
  const updateMutation = useUpdateAccountingDimensionFilter();

  const handleSubmit = (formData: Partial<AccountingDimensionFilter>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/accounting-dimension-filter") },
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
      <Button variant="ghost" onClick={() => router.push("/accounting-dimension-filter")}>← Back</Button>
      <AccountingDimensionFilterForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}