"use client";

// Detail page for Incoterm
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useIncoterm, useUpdateIncoterm } from "../hooks/incoterm.hooks.js";
import { IncotermForm } from "../forms/incoterm-form.js";
import type { Incoterm } from "../types/incoterm.js";
import { Button } from "@/components/ui/button";

export function IncotermDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useIncoterm(params.id);
  const updateMutation = useUpdateIncoterm();

  const handleSubmit = (formData: Partial<Incoterm>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/incoterm") },
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
      <Button variant="ghost" onClick={() => router.push("/incoterm")}>← Back</Button>
      <IncotermForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}