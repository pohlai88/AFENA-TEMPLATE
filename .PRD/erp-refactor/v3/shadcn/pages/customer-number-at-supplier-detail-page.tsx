"use client";

// Detail page for Customer Number At Supplier
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCustomerNumberAtSupplier, useUpdateCustomerNumberAtSupplier } from "../hooks/customer-number-at-supplier.hooks.js";
import { CustomerNumberAtSupplierForm } from "../forms/customer-number-at-supplier-form.js";
import type { CustomerNumberAtSupplier } from "../types/customer-number-at-supplier.js";
import { Button } from "@/components/ui/button";

export function CustomerNumberAtSupplierDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCustomerNumberAtSupplier(params.id);
  const updateMutation = useUpdateCustomerNumberAtSupplier();

  const handleSubmit = (formData: Partial<CustomerNumberAtSupplier>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/customer-number-at-supplier") },
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
      <Button variant="ghost" onClick={() => router.push("/customer-number-at-supplier")}>← Back</Button>
      <CustomerNumberAtSupplierForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}