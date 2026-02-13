"use client";

// Detail page for POS Closing Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosClosingEntry, useUpdatePosClosingEntry } from "../hooks/pos-closing-entry.hooks.js";
import { PosClosingEntryForm } from "../forms/pos-closing-entry-form.js";
import type { PosClosingEntry } from "../types/pos-closing-entry.js";
import { Button } from "@/components/ui/button";

export function PosClosingEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosClosingEntry(params.id);
  const updateMutation = useUpdatePosClosingEntry();

  const handleSubmit = (formData: Partial<PosClosingEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-closing-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-closing-entry")}>← Back</Button>
      <PosClosingEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}