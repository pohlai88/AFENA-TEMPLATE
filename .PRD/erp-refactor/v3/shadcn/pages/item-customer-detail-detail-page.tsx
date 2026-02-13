"use client";

// Detail page for Item Customer Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemCustomerDetail, useUpdateItemCustomerDetail } from "../hooks/item-customer-detail.hooks.js";
import { ItemCustomerDetailForm } from "../forms/item-customer-detail-form.js";
import type { ItemCustomerDetail } from "../types/item-customer-detail.js";
import { Button } from "@/components/ui/button";

export function ItemCustomerDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemCustomerDetail(params.id);
  const updateMutation = useUpdateItemCustomerDetail();

  const handleSubmit = (formData: Partial<ItemCustomerDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-customer-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/item-customer-detail")}>← Back</Button>
      <ItemCustomerDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}