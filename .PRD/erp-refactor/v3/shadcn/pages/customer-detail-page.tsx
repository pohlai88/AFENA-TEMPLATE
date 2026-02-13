"use client";

// Detail page for Customer
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCustomer, useUpdateCustomer } from "../hooks/customer.hooks.js";
import { CustomerForm } from "../forms/customer-form.js";
import type { Customer } from "../types/customer.js";
import { Button } from "@/components/ui/button";

export function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCustomer(params.id);
  const updateMutation = useUpdateCustomer();

  const handleSubmit = (formData: Partial<Customer>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/customer") },
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
      <Button variant="ghost" onClick={() => router.push("/customer")}>← Back</Button>
      <CustomerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}