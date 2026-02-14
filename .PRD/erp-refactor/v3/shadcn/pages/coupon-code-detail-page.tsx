"use client";

// Detail page for Coupon Code
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCouponCode, useUpdateCouponCode } from "../hooks/coupon-code.hooks.js";
import { CouponCodeForm } from "../forms/coupon-code-form.js";
import type { CouponCode } from "../types/coupon-code.js";
import { Button } from "@/components/ui/button";

export function CouponCodeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCouponCode(params.id);
  const updateMutation = useUpdateCouponCode();

  const handleSubmit = (formData: Partial<CouponCode>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/coupon-code") },
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
      <Button variant="ghost" onClick={() => router.push("/coupon-code")}>← Back</Button>
      <CouponCodeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}