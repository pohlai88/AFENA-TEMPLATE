"use client";

// Detail page for Master Production Schedule Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useMasterProductionScheduleItem, useUpdateMasterProductionScheduleItem } from "../hooks/master-production-schedule-item.hooks.js";
import { MasterProductionScheduleItemForm } from "../forms/master-production-schedule-item-form.js";
import type { MasterProductionScheduleItem } from "../types/master-production-schedule-item.js";
import { Button } from "@/components/ui/button";

export function MasterProductionScheduleItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useMasterProductionScheduleItem(params.id);
  const updateMutation = useUpdateMasterProductionScheduleItem();

  const handleSubmit = (formData: Partial<MasterProductionScheduleItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/master-production-schedule-item") },
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
      <Button variant="ghost" onClick={() => router.push("/master-production-schedule-item")}>← Back</Button>
      <MasterProductionScheduleItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}