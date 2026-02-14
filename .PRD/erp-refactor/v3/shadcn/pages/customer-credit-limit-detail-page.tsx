"use client";

// Detail page for Customer Credit Limit
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCustomerCreditLimit, useUpdateCustomerCreditLimit } from "../hooks/customer-credit-limit.hooks.js";
import { CustomerCreditLimitForm } from "../forms/customer-credit-limit-form.js";
import type { CustomerCreditLimit } from "../types/customer-credit-limit.js";
import { Button } from "@/components/ui/button";

export function CustomerCreditLimitDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCustomerCreditLimit(params.id);
  const updateMutation = useUpdateCustomerCreditLimit();

  const handleSubmit = (formData: Partial<CustomerCreditLimit>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/customer-credit-limit") },
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
      <Button variant="ghost" onClick={() => router.push("/customer-credit-limit")}>← Back</Button>
      <CustomerCreditLimitForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}