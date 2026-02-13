"use client";

// Detail page for POS Opening Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosOpeningEntry, useUpdatePosOpeningEntry } from "../hooks/pos-opening-entry.hooks.js";
import { PosOpeningEntryForm } from "../forms/pos-opening-entry-form.js";
import type { PosOpeningEntry } from "../types/pos-opening-entry.js";
import { Button } from "@/components/ui/button";

export function PosOpeningEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosOpeningEntry(params.id);
  const updateMutation = useUpdatePosOpeningEntry();

  const handleSubmit = (formData: Partial<PosOpeningEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-opening-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-opening-entry")}>← Back</Button>
      <PosOpeningEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}