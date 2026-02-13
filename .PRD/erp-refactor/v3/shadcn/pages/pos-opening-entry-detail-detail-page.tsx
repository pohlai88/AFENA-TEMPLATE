"use client";

// Detail page for POS Opening Entry Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosOpeningEntryDetail, useUpdatePosOpeningEntryDetail } from "../hooks/pos-opening-entry-detail.hooks.js";
import { PosOpeningEntryDetailForm } from "../forms/pos-opening-entry-detail-form.js";
import type { PosOpeningEntryDetail } from "../types/pos-opening-entry-detail.js";
import { Button } from "@/components/ui/button";

export function PosOpeningEntryDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosOpeningEntryDetail(params.id);
  const updateMutation = useUpdatePosOpeningEntryDetail();

  const handleSubmit = (formData: Partial<PosOpeningEntryDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-opening-entry-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-opening-entry-detail")}>← Back</Button>
      <PosOpeningEntryDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}