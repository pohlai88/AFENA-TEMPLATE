"use client";

// Detail page for POS Field
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosField, useUpdatePosField } from "../hooks/pos-field.hooks.js";
import { PosFieldForm } from "../forms/pos-field-form.js";
import type { PosField } from "../types/pos-field.js";
import { Button } from "@/components/ui/button";

export function PosFieldDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosField(params.id);
  const updateMutation = useUpdatePosField();

  const handleSubmit = (formData: Partial<PosField>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-field") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-field")}>← Back</Button>
      <PosFieldForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}