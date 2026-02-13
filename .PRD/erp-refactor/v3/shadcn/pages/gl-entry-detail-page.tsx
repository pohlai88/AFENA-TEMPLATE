"use client";

// Detail page for GL Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useGlEntry, useUpdateGlEntry } from "../hooks/gl-entry.hooks.js";
import { GlEntryForm } from "../forms/gl-entry-form.js";
import type { GlEntry } from "../types/gl-entry.js";
import { Button } from "@/components/ui/button";

export function GlEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useGlEntry(params.id);
  const updateMutation = useUpdateGlEntry();

  const handleSubmit = (formData: Partial<GlEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/gl-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/gl-entry")}>← Back</Button>
      <GlEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}