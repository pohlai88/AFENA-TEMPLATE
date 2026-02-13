"use client";

// Detail page for POS Closing Entry Taxes
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosClosingEntryTaxes, useUpdatePosClosingEntryTaxes } from "../hooks/pos-closing-entry-taxes.hooks.js";
import { PosClosingEntryTaxesForm } from "../forms/pos-closing-entry-taxes-form.js";
import type { PosClosingEntryTaxes } from "../types/pos-closing-entry-taxes.js";
import { Button } from "@/components/ui/button";

export function PosClosingEntryTaxesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosClosingEntryTaxes(params.id);
  const updateMutation = useUpdatePosClosingEntryTaxes();

  const handleSubmit = (formData: Partial<PosClosingEntryTaxes>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-closing-entry-taxes") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-closing-entry-taxes")}>← Back</Button>
      <PosClosingEntryTaxesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}