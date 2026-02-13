"use client";

// Detail page for Subscription Invoice
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useSubscriptionInvoice, useUpdateSubscriptionInvoice } from "../hooks/subscription-invoice.hooks.js";
import { SubscriptionInvoiceForm } from "../forms/subscription-invoice-form.js";
import type { SubscriptionInvoice } from "../types/subscription-invoice.js";
import { Button } from "@/components/ui/button";

export function SubscriptionInvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useSubscriptionInvoice(params.id);
  const updateMutation = useUpdateSubscriptionInvoice();

  const handleSubmit = (formData: Partial<SubscriptionInvoice>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/subscription-invoice") },
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
      <Button variant="ghost" onClick={() => router.push("/subscription-invoice")}>← Back</Button>
      <SubscriptionInvoiceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}