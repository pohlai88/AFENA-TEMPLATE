"use client";

// Detail page for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessStatementOfAccounts, useUpdateProcessStatementOfAccounts } from "../hooks/process-statement-of-accounts.hooks.js";
import { ProcessStatementOfAccountsForm } from "../forms/process-statement-of-accounts-form.js";
import type { ProcessStatementOfAccounts } from "../types/process-statement-of-accounts.js";
import { Button } from "@/components/ui/button";

export function ProcessStatementOfAccountsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessStatementOfAccounts(params.id);
  const updateMutation = useUpdateProcessStatementOfAccounts();

  const handleSubmit = (formData: Partial<ProcessStatementOfAccounts>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-statement-of-accounts") },
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
      <Button variant="ghost" onClick={() => router.push("/process-statement-of-accounts")}>← Back</Button>
      <ProcessStatementOfAccountsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}