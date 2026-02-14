"use client";

// Detail page for Bank Guarantee
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankGuarantee, useUpdateBankGuarantee } from "../hooks/bank-guarantee.hooks.js";
import { BankGuaranteeForm } from "../forms/bank-guarantee-form.js";
import type { BankGuarantee } from "../types/bank-guarantee.js";
import { Button } from "@/components/ui/button";

export function BankGuaranteeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankGuarantee(params.id);
  const updateMutation = useUpdateBankGuarantee();

  const handleSubmit = (formData: Partial<BankGuarantee>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-guarantee") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-guarantee")}>← Back</Button>
      <BankGuaranteeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}