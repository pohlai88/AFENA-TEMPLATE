"use client";

// Detail page for Supplier Number At Customer
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSupplierNumberAtCustomer, useUpdateSupplierNumberAtCustomer } from "../hooks/supplier-number-at-customer.hooks.js";
import { SupplierNumberAtCustomerForm } from "../forms/supplier-number-at-customer-form.js";
import type { SupplierNumberAtCustomer } from "../types/supplier-number-at-customer.js";
import { Button } from "@/components/ui/button";

export function SupplierNumberAtCustomerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSupplierNumberAtCustomer(params.id);
  const updateMutation = useUpdateSupplierNumberAtCustomer();

  const handleSubmit = (formData: Partial<SupplierNumberAtCustomer>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/supplier-number-at-customer") },
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
      <Button variant="ghost" onClick={() => router.push("/supplier-number-at-customer")}>← Back</Button>
      <SupplierNumberAtCustomerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}