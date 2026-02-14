"use client";

// Detail page for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaintenanceVisitPurpose, useUpdateMaintenanceVisitPurpose } from "../hooks/maintenance-visit-purpose.hooks.js";
import { MaintenanceVisitPurposeForm } from "../forms/maintenance-visit-purpose-form.js";
import type { MaintenanceVisitPurpose } from "../types/maintenance-visit-purpose.js";
import { Button } from "@/components/ui/button";

export function MaintenanceVisitPurposeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaintenanceVisitPurpose(params.id);
  const updateMutation = useUpdateMaintenanceVisitPurpose();

  const handleSubmit = (formData: Partial<MaintenanceVisitPurpose>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/maintenance-visit-purpose") },
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
      <Button variant="ghost" onClick={() => router.push("/maintenance-visit-purpose")}>← Back</Button>
      <MaintenanceVisitPurposeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}