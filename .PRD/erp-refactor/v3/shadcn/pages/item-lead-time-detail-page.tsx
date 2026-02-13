"use client";

// Detail page for Item Lead Time
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemLeadTime, useUpdateItemLeadTime } from "../hooks/item-lead-time.hooks.js";
import { ItemLeadTimeForm } from "../forms/item-lead-time-form.js";
import type { ItemLeadTime } from "../types/item-lead-time.js";
import { Button } from "@/components/ui/button";

export function ItemLeadTimeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemLeadTime(params.id);
  const updateMutation = useUpdateItemLeadTime();

  const handleSubmit = (formData: Partial<ItemLeadTime>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-lead-time") },
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
      <Button variant="ghost" onClick={() => router.push("/item-lead-time")}>← Back</Button>
      <ItemLeadTimeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}