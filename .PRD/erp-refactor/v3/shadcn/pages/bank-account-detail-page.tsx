"use client";

// Detail page for Bank Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankAccount, useUpdateBankAccount } from "../hooks/bank-account.hooks.js";
import { BankAccountForm } from "../forms/bank-account-form.js";
import type { BankAccount } from "../types/bank-account.js";
import { Button } from "@/components/ui/button";

export function BankAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankAccount(params.id);
  const updateMutation = useUpdateBankAccount();

  const handleSubmit = (formData: Partial<BankAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-account") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-account")}>← Back</Button>
      <BankAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}