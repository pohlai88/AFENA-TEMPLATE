"use client";

// Detail page for POS Item Group
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosItemGroup, useUpdatePosItemGroup } from "../hooks/pos-item-group.hooks.js";
import { PosItemGroupForm } from "../forms/pos-item-group-form.js";
import type { PosItemGroup } from "../types/pos-item-group.js";
import { Button } from "@/components/ui/button";

export function PosItemGroupDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosItemGroup(params.id);
  const updateMutation = useUpdatePosItemGroup();

  const handleSubmit = (formData: Partial<PosItemGroup>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-item-group") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-item-group")}>← Back</Button>
      <PosItemGroupForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}