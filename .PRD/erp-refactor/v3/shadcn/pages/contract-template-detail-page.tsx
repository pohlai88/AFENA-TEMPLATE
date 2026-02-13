"use client";

// Detail page for Contract Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useContractTemplate, useUpdateContractTemplate } from "../hooks/contract-template.hooks.js";
import { ContractTemplateForm } from "../forms/contract-template-form.js";
import type { ContractTemplate } from "../types/contract-template.js";
import { Button } from "@/components/ui/button";

export function ContractTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useContractTemplate(params.id);
  const updateMutation = useUpdateContractTemplate();

  const handleSubmit = (formData: Partial<ContractTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/contract-template") },
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
      <Button variant="ghost" onClick={() => router.push("/contract-template")}>← Back</Button>
      <ContractTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}