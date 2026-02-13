"use client";

// Detail page for Accounting Dimension
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountingDimension, useUpdateAccountingDimension } from "../hooks/accounting-dimension.hooks.js";
import { AccountingDimensionForm } from "../forms/accounting-dimension-form.js";
import type { AccountingDimension } from "../types/accounting-dimension.js";
import { Button } from "@/components/ui/button";

export function AccountingDimensionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountingDimension(params.id);
  const updateMutation = useUpdateAccountingDimension();

  const handleSubmit = (formData: Partial<AccountingDimension>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/accounting-dimension") },
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
      <Button variant="ghost" onClick={() => router.push("/accounting-dimension")}>← Back</Button>
      <AccountingDimensionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}