"use client";

// Detail page for Bank Clearance Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankClearanceDetail, useUpdateBankClearanceDetail } from "../hooks/bank-clearance-detail.hooks.js";
import { BankClearanceDetailForm } from "../forms/bank-clearance-detail-form.js";
import type { BankClearanceDetail } from "../types/bank-clearance-detail.js";
import { Button } from "@/components/ui/button";

export function BankClearanceDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankClearanceDetail(params.id);
  const updateMutation = useUpdateBankClearanceDetail();

  const handleSubmit = (formData: Partial<BankClearanceDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-clearance-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-clearance-detail")}>← Back</Button>
      <BankClearanceDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}