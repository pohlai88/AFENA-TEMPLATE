"use client";

// Detail page for Bank Clearance
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankClearance, useUpdateBankClearance } from "../hooks/bank-clearance.hooks.js";
import { BankClearanceForm } from "../forms/bank-clearance-form.js";
import type { BankClearance } from "../types/bank-clearance.js";
import { Button } from "@/components/ui/button";

export function BankClearanceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankClearance(params.id);
  const updateMutation = useUpdateBankClearance();

  const handleSubmit = (formData: Partial<BankClearance>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-clearance") },
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
      <Button variant="ghost" onClick={() => router.push("/bank-clearance")}>← Back</Button>
      <BankClearanceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}