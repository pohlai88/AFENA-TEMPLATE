"use client";

// Detail page for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountingDimensionDetail, useUpdateAccountingDimensionDetail } from "../hooks/accounting-dimension-detail.hooks.js";
import { AccountingDimensionDetailForm } from "../forms/accounting-dimension-detail-form.js";
import type { AccountingDimensionDetail } from "../types/accounting-dimension-detail.js";
import { Button } from "@/components/ui/button";

export function AccountingDimensionDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountingDimensionDetail(params.id);
  const updateMutation = useUpdateAccountingDimensionDetail();

  const handleSubmit = (formData: Partial<AccountingDimensionDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/accounting-dimension-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/accounting-dimension-detail")}>← Back</Button>
      <AccountingDimensionDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}