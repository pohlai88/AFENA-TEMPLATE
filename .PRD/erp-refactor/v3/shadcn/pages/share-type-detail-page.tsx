"use client";

// Detail page for Share Type
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShareType, useUpdateShareType } from "../hooks/share-type.hooks.js";
import { ShareTypeForm } from "../forms/share-type-form.js";
import type { ShareType } from "../types/share-type.js";
import { Button } from "@/components/ui/button";

export function ShareTypeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShareType(params.id);
  const updateMutation = useUpdateShareType();

  const handleSubmit = (formData: Partial<ShareType>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/share-type") },
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
      <Button variant="ghost" onClick={() => router.push("/share-type")}>← Back</Button>
      <ShareTypeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}