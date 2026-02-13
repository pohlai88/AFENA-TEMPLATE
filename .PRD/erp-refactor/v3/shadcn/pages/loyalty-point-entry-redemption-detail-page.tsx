"use client";

// Detail page for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLoyaltyPointEntryRedemption, useUpdateLoyaltyPointEntryRedemption } from "../hooks/loyalty-point-entry-redemption.hooks.js";
import { LoyaltyPointEntryRedemptionForm } from "../forms/loyalty-point-entry-redemption-form.js";
import type { LoyaltyPointEntryRedemption } from "../types/loyalty-point-entry-redemption.js";
import { Button } from "@/components/ui/button";

export function LoyaltyPointEntryRedemptionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLoyaltyPointEntryRedemption(params.id);
  const updateMutation = useUpdateLoyaltyPointEntryRedemption();

  const handleSubmit = (formData: Partial<LoyaltyPointEntryRedemption>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/loyalty-point-entry-redemption") },
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
      <Button variant="ghost" onClick={() => router.push("/loyalty-point-entry-redemption")}>← Back</Button>
      <LoyaltyPointEntryRedemptionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}