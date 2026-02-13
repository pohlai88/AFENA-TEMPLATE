"use client";

// Detail page for Dunning
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDunning, useUpdateDunning } from "../hooks/dunning.hooks.js";
import { DunningForm } from "../forms/dunning-form.js";
import type { Dunning } from "../types/dunning.js";
import { Button } from "@/components/ui/button";

export function DunningDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDunning(params.id);
  const updateMutation = useUpdateDunning();

  const handleSubmit = (formData: Partial<Dunning>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/dunning") },
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
      <Button variant="ghost" onClick={() => router.push("/dunning")}>← Back</Button>
      <DunningForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}