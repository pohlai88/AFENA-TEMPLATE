"use client";

// Detail page for Sales Partner Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSalesPartnerItem, useUpdateSalesPartnerItem } from "../hooks/sales-partner-item.hooks.js";
import { SalesPartnerItemForm } from "../forms/sales-partner-item-form.js";
import type { SalesPartnerItem } from "../types/sales-partner-item.js";
import { Button } from "@/components/ui/button";

export function SalesPartnerItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSalesPartnerItem(params.id);
  const updateMutation = useUpdateSalesPartnerItem();

  const handleSubmit = (formData: Partial<SalesPartnerItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/sales-partner-item") },
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
      <Button variant="ghost" onClick={() => router.push("/sales-partner-item")}>← Back</Button>
      <SalesPartnerItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}