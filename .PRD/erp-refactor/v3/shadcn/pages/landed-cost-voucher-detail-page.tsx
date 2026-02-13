"use client";

// Detail page for Landed Cost Voucher
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLandedCostVoucher, useUpdateLandedCostVoucher } from "../hooks/landed-cost-voucher.hooks.js";
import { LandedCostVoucherForm } from "../forms/landed-cost-voucher-form.js";
import type { LandedCostVoucher } from "../types/landed-cost-voucher.js";
import { Button } from "@/components/ui/button";

export function LandedCostVoucherDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLandedCostVoucher(params.id);
  const updateMutation = useUpdateLandedCostVoucher();

  const handleSubmit = (formData: Partial<LandedCostVoucher>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/landed-cost-voucher") },
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
      <Button variant="ghost" onClick={() => router.push("/landed-cost-voucher")}>← Back</Button>
      <LandedCostVoucherForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}