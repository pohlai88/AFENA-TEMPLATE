"use client";

// Detail page for Contract Template Fulfilment Terms
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useContractTemplateFulfilmentTerms, useUpdateContractTemplateFulfilmentTerms } from "../hooks/contract-template-fulfilment-terms.hooks.js";
import { ContractTemplateFulfilmentTermsForm } from "../forms/contract-template-fulfilment-terms-form.js";
import type { ContractTemplateFulfilmentTerms } from "../types/contract-template-fulfilment-terms.js";
import { Button } from "@/components/ui/button";

export function ContractTemplateFulfilmentTermsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useContractTemplateFulfilmentTerms(params.id);
  const updateMutation = useUpdateContractTemplateFulfilmentTerms();

  const handleSubmit = (formData: Partial<ContractTemplateFulfilmentTerms>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/contract-template-fulfilment-terms") },
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
      <Button variant="ghost" onClick={() => router.push("/contract-template-fulfilment-terms")}>← Back</Button>
      <ContractTemplateFulfilmentTermsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}