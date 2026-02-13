"use client";

// Detail page for Item Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemGroup, useUpdateItemGroup } from "../hooks/item-group.hooks.js";
import { ItemGroupForm } from "../forms/item-group-form.js";
import type { ItemGroup } from "../types/item-group.js";
import { Button } from "@/components/ui/button";

export function ItemGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemGroup(params.id);
  const updateMutation = useUpdateItemGroup();

  const handleSubmit = (formData: Partial<ItemGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-group") },
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
      <Button variant="ghost" onClick={() => router.push("/item-group")}>← Back</Button>
      <ItemGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}