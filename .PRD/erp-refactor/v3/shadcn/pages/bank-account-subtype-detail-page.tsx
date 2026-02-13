"use client";

// Detail page for Bank Account Subtype
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankAccountSubtype, useUpdateBankAccountSubtype } from "../hooks/bank-account-subtype.hooks.js";
import { BankAccountSubtypeForm } from "../forms/bank-account-subtype-form.js";
import type { BankAccountSubtype } from "../types/bank-account-subtype.js";
import { Button } from "@/components/ui/button";

export function BankAccountSubtypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankAccountSubtype(params.id);
  const updateMutation = useUpdateBankAccountSubtype();

  const handleSubmit = (formData: Partial<BankAccountSubtype>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-account-subtype") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-account-subtype")}>← Back</Button>
      <BankAccountSubtypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}