"use client";

// Detail page for Workstation Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useWorkstationType, useUpdateWorkstationType } from "../hooks/workstation-type.hooks.js";
import { WorkstationTypeForm } from "../forms/workstation-type-form.js";
import type { WorkstationType } from "../types/workstation-type.js";
import { Button } from "@/components/ui/button";

export function WorkstationTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useWorkstationType(params.id);
  const updateMutation = useUpdateWorkstationType();

  const handleSubmit = (formData: Partial<WorkstationType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/workstation-type") },
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
      <Button variant="ghost" onClick={() => router.push("/workstation-type")}>← Back</Button>
      <WorkstationTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}