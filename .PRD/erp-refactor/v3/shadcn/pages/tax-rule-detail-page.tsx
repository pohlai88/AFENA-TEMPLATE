"use client";

// Detail page for Tax Rule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTaxRule, useUpdateTaxRule } from "../hooks/tax-rule.hooks.js";
import { TaxRuleForm } from "../forms/tax-rule-form.js";
import type { TaxRule } from "../types/tax-rule.js";
import { Button } from "@/components/ui/button";

export function TaxRuleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTaxRule(params.id);
  const updateMutation = useUpdateTaxRule();

  const handleSubmit = (formData: Partial<TaxRule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/tax-rule") },
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
      <Button variant="ghost" onClick={() => router.push("/tax-rule")}>← Back</Button>
      <TaxRuleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}