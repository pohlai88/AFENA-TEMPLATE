"use client";

// Detail page for Account Closing Balance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountClosingBalance, useUpdateAccountClosingBalance } from "../hooks/account-closing-balance.hooks.js";
import { AccountClosingBalanceForm } from "../forms/account-closing-balance-form.js";
import type { AccountClosingBalance } from "../types/account-closing-balance.js";
import { Button } from "@/components/ui/button";

export function AccountClosingBalanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountClosingBalance(params.id);
  const updateMutation = useUpdateAccountClosingBalance();

  const handleSubmit = (formData: Partial<AccountClosingBalance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/account-closing-balance") },
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
      <Button variant="ghost" onClick={() => router.push("/account-closing-balance")}>← Back</Button>
      <AccountClosingBalanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}