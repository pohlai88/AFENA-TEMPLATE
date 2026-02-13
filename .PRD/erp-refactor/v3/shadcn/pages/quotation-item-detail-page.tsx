"use client";

// Detail page for Quotation Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQuotationItem, useUpdateQuotationItem } from "../hooks/quotation-item.hooks.js";
import { QuotationItemForm } from "../forms/quotation-item-form.js";
import type { QuotationItem } from "../types/quotation-item.js";
import { Button } from "@/components/ui/button";

export function QuotationItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQuotationItem(params.id);
  const updateMutation = useUpdateQuotationItem();

  const handleSubmit = (formData: Partial<QuotationItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quotation-item") },
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
      <Button variant="ghost" onClick={() => router.push("/quotation-item")}>← Back</Button>
      <QuotationItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}