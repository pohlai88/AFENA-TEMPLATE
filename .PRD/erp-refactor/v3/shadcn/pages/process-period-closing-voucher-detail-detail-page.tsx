"use client";

// Detail page for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessPeriodClosingVoucherDetail, useUpdateProcessPeriodClosingVoucherDetail } from "../hooks/process-period-closing-voucher-detail.hooks.js";
import { ProcessPeriodClosingVoucherDetailForm } from "../forms/process-period-closing-voucher-detail-form.js";
import type { ProcessPeriodClosingVoucherDetail } from "../types/process-period-closing-voucher-detail.js";
import { Button } from "@/components/ui/button";

export function ProcessPeriodClosingVoucherDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessPeriodClosingVoucherDetail(params.id);
  const updateMutation = useUpdateProcessPeriodClosingVoucherDetail();

  const handleSubmit = (formData: Partial<ProcessPeriodClosingVoucherDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-period-closing-voucher-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/process-period-closing-voucher-detail")}>← Back</Button>
      <ProcessPeriodClosingVoucherDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}