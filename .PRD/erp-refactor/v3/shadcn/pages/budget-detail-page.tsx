"use client";

// Detail page for Budget
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBudget, useUpdateBudget } from "../hooks/budget.hooks.js";
import { BudgetForm } from "../forms/budget-form.js";
import type { Budget } from "../types/budget.js";
import { Button } from "@/components/ui/button";

export function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBudget(params.id);
  const updateMutation = useUpdateBudget();

  const handleSubmit = (formData: Partial<Budget>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/budget") },
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
      <Button variant="ghost" onClick={() => router.push("/budget")}>← Back</Button>
      <BudgetForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}