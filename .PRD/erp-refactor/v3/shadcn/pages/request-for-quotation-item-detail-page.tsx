"use client";

// Detail page for Request for Quotation Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRequestForQuotationItem, useUpdateRequestForQuotationItem } from "../hooks/request-for-quotation-item.hooks.js";
import { RequestForQuotationItemForm } from "../forms/request-for-quotation-item-form.js";
import type { RequestForQuotationItem } from "../types/request-for-quotation-item.js";
import { Button } from "@/components/ui/button";

export function RequestForQuotationItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRequestForQuotationItem(params.id);
  const updateMutation = useUpdateRequestForQuotationItem();

  const handleSubmit = (formData: Partial<RequestForQuotationItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/request-for-quotation-item") },
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
      <Button variant="ghost" onClick={() => router.push("/request-for-quotation-item")}>← Back</Button>
      <RequestForQuotationItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}