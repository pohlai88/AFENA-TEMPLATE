"use client";

// Detail page for Opening Invoice Creation Tool Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useOpeningInvoiceCreationToolItem, useUpdateOpeningInvoiceCreationToolItem } from "../hooks/opening-invoice-creation-tool-item.hooks.js";
import { OpeningInvoiceCreationToolItemForm } from "../forms/opening-invoice-creation-tool-item-form.js";
import type { OpeningInvoiceCreationToolItem } from "../types/opening-invoice-creation-tool-item.js";
import { Button } from "@/components/ui/button";

export function OpeningInvoiceCreationToolItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useOpeningInvoiceCreationToolItem(params.id);
  const updateMutation = useUpdateOpeningInvoiceCreationToolItem();

  const handleSubmit = (formData: Partial<OpeningInvoiceCreationToolItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/opening-invoice-creation-tool-item") },
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
      <Button variant="ghost" onClick={() => router.push("/opening-invoice-creation-tool-item")}>← Back</Button>
      <OpeningInvoiceCreationToolItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}