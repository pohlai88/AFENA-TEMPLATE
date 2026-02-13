"use client";

// Detail page for Pick List Item
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePickListItem, useUpdatePickListItem } from "../hooks/pick-list-item.hooks.js";
import { PickListItemForm } from "../forms/pick-list-item-form.js";
import type { PickListItem } from "../types/pick-list-item.js";
import { Button } from "@/components/ui/button";

export function PickListItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePickListItem(params.id);
  const updateMutation = useUpdatePickListItem();

  const handleSubmit = (formData: Partial<PickListItem>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pick-list-item") },
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
      <Button variant="ghost" onClick={() => router.push("/pick-list-item")}>← Back</Button>
      <PickListItemForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}