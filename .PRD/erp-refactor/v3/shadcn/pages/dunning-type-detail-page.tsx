"use client";

// Detail page for Dunning Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDunningType, useUpdateDunningType } from "../hooks/dunning-type.hooks.js";
import { DunningTypeForm } from "../forms/dunning-type-form.js";
import type { DunningType } from "../types/dunning-type.js";
import { Button } from "@/components/ui/button";

export function DunningTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDunningType(params.id);
  const updateMutation = useUpdateDunningType();

  const handleSubmit = (formData: Partial<DunningType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/dunning-type") },
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
      <Button variant="ghost" onClick={() => router.push("/dunning-type")}>← Back</Button>
      <DunningTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}