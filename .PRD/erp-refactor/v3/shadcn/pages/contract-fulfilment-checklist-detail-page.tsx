"use client";

// Detail page for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useContractFulfilmentChecklist, useUpdateContractFulfilmentChecklist } from "../hooks/contract-fulfilment-checklist.hooks.js";
import { ContractFulfilmentChecklistForm } from "../forms/contract-fulfilment-checklist-form.js";
import type { ContractFulfilmentChecklist } from "../types/contract-fulfilment-checklist.js";
import { Button } from "@/components/ui/button";

export function ContractFulfilmentChecklistDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useContractFulfilmentChecklist(params.id);
  const updateMutation = useUpdateContractFulfilmentChecklist();

  const handleSubmit = (formData: Partial<ContractFulfilmentChecklist>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/contract-fulfilment-checklist") },
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
      <Button variant="ghost" onClick={() => router.push("/contract-fulfilment-checklist")}>← Back</Button>
      <ContractFulfilmentChecklistForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}