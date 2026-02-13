"use client";

// Detail page for POS Closing Entry Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosClosingEntryDetail, useUpdatePosClosingEntryDetail } from "../hooks/pos-closing-entry-detail.hooks.js";
import { PosClosingEntryDetailForm } from "../forms/pos-closing-entry-detail-form.js";
import type { PosClosingEntryDetail } from "../types/pos-closing-entry-detail.js";
import { Button } from "@/components/ui/button";

export function PosClosingEntryDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosClosingEntryDetail(params.id);
  const updateMutation = useUpdatePosClosingEntryDetail();

  const handleSubmit = (formData: Partial<PosClosingEntryDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-closing-entry-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-closing-entry-detail")}>← Back</Button>
      <PosClosingEntryDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}