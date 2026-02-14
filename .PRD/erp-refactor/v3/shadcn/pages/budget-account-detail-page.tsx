"use client";

// Detail page for Budget Account
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBudgetAccount, useUpdateBudgetAccount } from "../hooks/budget-account.hooks.js";
import { BudgetAccountForm } from "../forms/budget-account-form.js";
import type { BudgetAccount } from "../types/budget-account.js";
import { Button } from "@/components/ui/button";

export function BudgetAccountDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBudgetAccount(params.id);
  const updateMutation = useUpdateBudgetAccount();

  const handleSubmit = (formData: Partial<BudgetAccount>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/budget-account") },
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
      <Button variant="ghost" onClick={() => router.push("/budget-account")}>← Back</Button>
      <BudgetAccountForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}