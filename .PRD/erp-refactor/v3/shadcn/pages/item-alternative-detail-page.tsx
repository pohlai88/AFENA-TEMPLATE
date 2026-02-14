"use client";

// Detail page for Item Alternative
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemAlternative, useUpdateItemAlternative } from "../hooks/item-alternative.hooks.js";
import { ItemAlternativeForm } from "../forms/item-alternative-form.js";
import type { ItemAlternative } from "../types/item-alternative.js";
import { Button } from "@/components/ui/button";

export function ItemAlternativeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemAlternative(params.id);
  const updateMutation = useUpdateItemAlternative();

  const handleSubmit = (formData: Partial<ItemAlternative>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-alternative") },
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
      <Button variant="ghost" onClick={() => router.push("/item-alternative")}>← Back</Button>
      <ItemAlternativeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}