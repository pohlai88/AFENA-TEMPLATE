"use client";

// Detail page for Unreconcile Payment Entries
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useUnreconcilePaymentEntries, useUpdateUnreconcilePaymentEntries } from "../hooks/unreconcile-payment-entries.hooks.js";
import { UnreconcilePaymentEntriesForm } from "../forms/unreconcile-payment-entries-form.js";
import type { UnreconcilePaymentEntries } from "../types/unreconcile-payment-entries.js";
import { Button } from "@/components/ui/button";

export function UnreconcilePaymentEntriesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useUnreconcilePaymentEntries(params.id);
  const updateMutation = useUpdateUnreconcilePaymentEntries();

  const handleSubmit = (formData: Partial<UnreconcilePaymentEntries>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/unreconcile-payment-entries") },
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
      <Button variant="ghost" onClick={() => router.push("/unreconcile-payment-entries")}>← Back</Button>
      <UnreconcilePaymentEntriesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}