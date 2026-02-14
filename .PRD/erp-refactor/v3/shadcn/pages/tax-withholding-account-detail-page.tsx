"use client";

// Detail page for Tax Withholding Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxWithholdingAccount, useUpdateTaxWithholdingAccount } from "../hooks/tax-withholding-account.hooks.js";
import { TaxWithholdingAccountForm } from "../forms/tax-withholding-account-form.js";
import type { TaxWithholdingAccount } from "../types/tax-withholding-account.js";
import { Button } from "@/components/ui/button";

export function TaxWithholdingAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxWithholdingAccount(params.id);
  const updateMutation = useUpdateTaxWithholdingAccount();

  const handleSubmit = (formData: Partial<TaxWithholdingAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-withholding-account") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-withholding-account")}>← Back</Button>
      <TaxWithholdingAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}