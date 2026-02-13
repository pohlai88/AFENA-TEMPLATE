"use client";

// Detail page for Workstation Operating Component
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkstationOperatingComponent, useUpdateWorkstationOperatingComponent } from "../hooks/workstation-operating-component.hooks.js";
import { WorkstationOperatingComponentForm } from "../forms/workstation-operating-component-form.js";
import type { WorkstationOperatingComponent } from "../types/workstation-operating-component.js";
import { Button } from "@/components/ui/button";

export function WorkstationOperatingComponentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkstationOperatingComponent(params.id);
  const updateMutation = useUpdateWorkstationOperatingComponent();

  const handleSubmit = (formData: Partial<WorkstationOperatingComponent>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/workstation-operating-component") },
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
      <Button variant="ghost" onClick={() => router.push("/workstation-operating-component")}>← Back</Button>
      <WorkstationOperatingComponentForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}