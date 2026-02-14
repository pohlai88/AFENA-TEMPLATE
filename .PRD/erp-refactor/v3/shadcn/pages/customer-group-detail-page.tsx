"use client";

// Detail page for Customer Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCustomerGroup, useUpdateCustomerGroup } from "../hooks/customer-group.hooks.js";
import { CustomerGroupForm } from "../forms/customer-group-form.js";
import type { CustomerGroup } from "../types/customer-group.js";
import { Button } from "@/components/ui/button";

export function CustomerGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCustomerGroup(params.id);
  const updateMutation = useUpdateCustomerGroup();

  const handleSubmit = (formData: Partial<CustomerGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/customer-group") },
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
      <Button variant="ghost" onClick={() => router.push("/customer-group")}>← Back</Button>
      <CustomerGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}