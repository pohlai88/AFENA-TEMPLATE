"use client";

// Detail page for Prospect
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProspect, useUpdateProspect } from "../hooks/prospect.hooks.js";
import { ProspectForm } from "../forms/prospect-form.js";
import type { Prospect } from "../types/prospect.js";
import { Button } from "@/components/ui/button";

export function ProspectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProspect(params.id);
  const updateMutation = useUpdateProspect();

  const handleSubmit = (formData: Partial<Prospect>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/prospect") },
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
      <Button variant="ghost" onClick={() => router.push("/prospect")}>← Back</Button>
      <ProspectForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}