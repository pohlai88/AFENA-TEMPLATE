"use client";

// Detail page for Bank Account Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankAccountType, useUpdateBankAccountType } from "../hooks/bank-account-type.hooks.js";
import { BankAccountTypeForm } from "../forms/bank-account-type-form.js";
import type { BankAccountType } from "../types/bank-account-type.js";
import { Button } from "@/components/ui/button";

export function BankAccountTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankAccountType(params.id);
  const updateMutation = useUpdateBankAccountType();

  const handleSubmit = (formData: Partial<BankAccountType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-account-type") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-account-type")}>← Back</Button>
      <BankAccountTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}