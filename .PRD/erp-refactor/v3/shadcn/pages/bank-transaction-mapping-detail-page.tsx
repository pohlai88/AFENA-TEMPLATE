"use client";

// Detail page for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankTransactionMapping, useUpdateBankTransactionMapping } from "../hooks/bank-transaction-mapping.hooks.js";
import { BankTransactionMappingForm } from "../forms/bank-transaction-mapping-form.js";
import type { BankTransactionMapping } from "../types/bank-transaction-mapping.js";
import { Button } from "@/components/ui/button";

export function BankTransactionMappingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankTransactionMapping(params.id);
  const updateMutation = useUpdateBankTransactionMapping();

  const handleSubmit = (formData: Partial<BankTransactionMapping>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-transaction-mapping") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-transaction-mapping")}>← Back</Button>
      <BankTransactionMappingForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}