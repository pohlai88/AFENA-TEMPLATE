"use client";

// Detail page for Tax Withholding Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxWithholdingGroup, useUpdateTaxWithholdingGroup } from "../hooks/tax-withholding-group.hooks.js";
import { TaxWithholdingGroupForm } from "../forms/tax-withholding-group-form.js";
import type { TaxWithholdingGroup } from "../types/tax-withholding-group.js";
import { Button } from "@/components/ui/button";

export function TaxWithholdingGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxWithholdingGroup(params.id);
  const updateMutation = useUpdateTaxWithholdingGroup();

  const handleSubmit = (formData: Partial<TaxWithholdingGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-withholding-group") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-withholding-group")}>← Back</Button>
      <TaxWithholdingGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}