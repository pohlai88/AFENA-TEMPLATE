"use client";

// Detail page for Process Statement Of Accounts Customer
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessStatementOfAccountsCustomer, useUpdateProcessStatementOfAccountsCustomer } from "../hooks/process-statement-of-accounts-customer.hooks.js";
import { ProcessStatementOfAccountsCustomerForm } from "../forms/process-statement-of-accounts-customer-form.js";
import type { ProcessStatementOfAccountsCustomer } from "../types/process-statement-of-accounts-customer.js";
import { Button } from "@/components/ui/button";

export function ProcessStatementOfAccountsCustomerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessStatementOfAccountsCustomer(params.id);
  const updateMutation = useUpdateProcessStatementOfAccountsCustomer();

  const handleSubmit = (formData: Partial<ProcessStatementOfAccountsCustomer>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-statement-of-accounts-customer") },
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
      <Button variant="ghost" onClick={() => router.push("/process-statement-of-accounts-customer")}>← Back</Button>
      <ProcessStatementOfAccountsCustomerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}