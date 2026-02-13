"use client";

// Detail page for Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePeriodClosingVoucher, useUpdatePeriodClosingVoucher } from "../hooks/period-closing-voucher.hooks.js";
import { PeriodClosingVoucherForm } from "../forms/period-closing-voucher-form.js";
import type { PeriodClosingVoucher } from "../types/period-closing-voucher.js";
import { Button } from "@/components/ui/button";

export function PeriodClosingVoucherDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePeriodClosingVoucher(params.id);
  const updateMutation = useUpdatePeriodClosingVoucher();

  const handleSubmit = (formData: Partial<PeriodClosingVoucher>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/period-closing-voucher") },
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
      <Button variant="ghost" onClick={() => router.push("/period-closing-voucher")}>← Back</Button>
      <PeriodClosingVoucherForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}