"use client";

// Detail page for Process Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessPeriodClosingVoucher, useUpdateProcessPeriodClosingVoucher } from "../hooks/process-period-closing-voucher.hooks.js";
import { ProcessPeriodClosingVoucherForm } from "../forms/process-period-closing-voucher-form.js";
import type { ProcessPeriodClosingVoucher } from "../types/process-period-closing-voucher.js";
import { Button } from "@/components/ui/button";

export function ProcessPeriodClosingVoucherDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessPeriodClosingVoucher(params.id);
  const updateMutation = useUpdateProcessPeriodClosingVoucher();

  const handleSubmit = (formData: Partial<ProcessPeriodClosingVoucher>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-period-closing-voucher") },
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
      <Button variant="ghost" onClick={() => router.push("/process-period-closing-voucher")}>← Back</Button>
      <ProcessPeriodClosingVoucherForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}