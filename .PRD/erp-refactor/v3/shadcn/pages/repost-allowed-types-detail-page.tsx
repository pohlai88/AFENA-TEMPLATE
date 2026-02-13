"use client";

// Detail page for Repost Allowed Types
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useRepostAllowedTypes, useUpdateRepostAllowedTypes } from "../hooks/repost-allowed-types.hooks.js";
import { RepostAllowedTypesForm } from "../forms/repost-allowed-types-form.js";
import type { RepostAllowedTypes } from "../types/repost-allowed-types.js";
import { Button } from "@/components/ui/button";

export function RepostAllowedTypesDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useRepostAllowedTypes(params.id);
  const updateMutation = useUpdateRepostAllowedTypes();

  const handleSubmit = (formData: Partial<RepostAllowedTypes>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/repost-allowed-types") },
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
      <Button variant="ghost" onClick={() => router.push("/repost-allowed-types")}>← Back</Button>
      <RepostAllowedTypesForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}