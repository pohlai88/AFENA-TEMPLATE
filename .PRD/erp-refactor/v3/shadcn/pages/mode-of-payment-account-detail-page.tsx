"use client";

// Detail page for Mode of Payment Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useModeOfPaymentAccount, useUpdateModeOfPaymentAccount } from "../hooks/mode-of-payment-account.hooks.js";
import { ModeOfPaymentAccountForm } from "../forms/mode-of-payment-account-form.js";
import type { ModeOfPaymentAccount } from "../types/mode-of-payment-account.js";
import { Button } from "@/components/ui/button";

export function ModeOfPaymentAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useModeOfPaymentAccount(params.id);
  const updateMutation = useUpdateModeOfPaymentAccount();

  const handleSubmit = (formData: Partial<ModeOfPaymentAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/mode-of-payment-account") },
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
      <Button variant="ghost" onClick={() => router.push("/mode-of-payment-account")}>← Back</Button>
      <ModeOfPaymentAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}