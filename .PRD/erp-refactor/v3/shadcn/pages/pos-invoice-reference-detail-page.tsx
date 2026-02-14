"use client";

// Detail page for POS Invoice Reference
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosInvoiceReference, useUpdatePosInvoiceReference } from "../hooks/pos-invoice-reference.hooks.js";
import { PosInvoiceReferenceForm } from "../forms/pos-invoice-reference-form.js";
import type { PosInvoiceReference } from "../types/pos-invoice-reference.js";
import { Button } from "@/components/ui/button";

export function PosInvoiceReferenceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosInvoiceReference(params.id);
  const updateMutation = useUpdatePosInvoiceReference();

  const handleSubmit = (formData: Partial<PosInvoiceReference>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-invoice-reference") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-invoice-reference")}>← Back</Button>
      <PosInvoiceReferenceForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}