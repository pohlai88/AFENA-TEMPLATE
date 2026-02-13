"use client";

// Detail page for Maintenance Visit
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMaintenanceVisit, useUpdateMaintenanceVisit } from "../hooks/maintenance-visit.hooks.js";
import { MaintenanceVisitForm } from "../forms/maintenance-visit-form.js";
import type { MaintenanceVisit } from "../types/maintenance-visit.js";
import { Button } from "@/components/ui/button";

export function MaintenanceVisitDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMaintenanceVisit(params.id);
  const updateMutation = useUpdateMaintenanceVisit();

  const handleSubmit = (formData: Partial<MaintenanceVisit>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/maintenance-visit") },
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
      <Button variant="ghost" onClick={() => router.push("/maintenance-visit")}>← Back</Button>
      <MaintenanceVisitForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}