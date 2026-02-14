"use client";

// Detail page for Quality Action
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useQualityAction, useUpdateQualityAction } from "../hooks/quality-action.hooks.js";
import { QualityActionForm } from "../forms/quality-action-form.js";
import type { QualityAction } from "../types/quality-action.js";
import { Button } from "@/components/ui/button";

export function QualityActionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useQualityAction(params.id);
  const updateMutation = useUpdateQualityAction();

  const handleSubmit = (formData: Partial<QualityAction>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/quality-action") },
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
      <Button variant="ghost" onClick={() => router.push("/quality-action")}>← Back</Button>
      <QualityActionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}