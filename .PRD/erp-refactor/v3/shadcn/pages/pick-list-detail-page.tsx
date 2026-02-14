"use client";

// Detail page for Pick List
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePickList, useUpdatePickList } from "../hooks/pick-list.hooks.js";
import { PickListForm } from "../forms/pick-list-form.js";
import type { PickList } from "../types/pick-list.js";
import { Button } from "@/components/ui/button";

export function PickListDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePickList(params.id);
  const updateMutation = useUpdatePickList();

  const handleSubmit = (formData: Partial<PickList>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pick-list") },
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
      <Button variant="ghost" onClick={() => router.push("/pick-list")}>← Back</Button>
      <PickListForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}