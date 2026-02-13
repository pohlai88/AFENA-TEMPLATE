"use client";

// Detail page for Item Default
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemDefault, useUpdateItemDefault } from "../hooks/item-default.hooks.js";
import { ItemDefaultForm } from "../forms/item-default-form.js";
import type { ItemDefault } from "../types/item-default.js";
import { Button } from "@/components/ui/button";

export function ItemDefaultDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemDefault(params.id);
  const updateMutation = useUpdateItemDefault();

  const handleSubmit = (formData: Partial<ItemDefault>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-default") },
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
      <Button variant="ghost" onClick={() => router.push("/item-default")}>← Back</Button>
      <ItemDefaultForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}