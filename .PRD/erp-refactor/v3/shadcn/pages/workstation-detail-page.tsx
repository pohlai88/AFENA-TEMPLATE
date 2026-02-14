"use client";

// Detail page for Workstation
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkstation, useUpdateWorkstation } from "../hooks/workstation.hooks.js";
import { WorkstationForm } from "../forms/workstation-form.js";
import type { Workstation } from "../types/workstation.js";
import { Button } from "@/components/ui/button";

export function WorkstationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkstation(params.id);
  const updateMutation = useUpdateWorkstation();

  const handleSubmit = (formData: Partial<Workstation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/workstation") },
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
      <Button variant="ghost" onClick={() => router.push("/workstation")}>← Back</Button>
      <WorkstationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}