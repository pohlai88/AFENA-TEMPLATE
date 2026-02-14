"use client";

// Detail page for Customer Group Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCustomerGroupItem, useUpdateCustomerGroupItem } from "../hooks/customer-group-item.hooks.js";
import { CustomerGroupItemForm } from "../forms/customer-group-item-form.js";
import type { CustomerGroupItem } from "../types/customer-group-item.js";
import { Button } from "@/components/ui/button";

export function CustomerGroupItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCustomerGroupItem(params.id);
  const updateMutation = useUpdateCustomerGroupItem();

  const handleSubmit = (formData: Partial<CustomerGroupItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/customer-group-item") },
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
      <Button variant="ghost" onClick={() => router.push("/customer-group-item")}>← Back</Button>
      <CustomerGroupItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}