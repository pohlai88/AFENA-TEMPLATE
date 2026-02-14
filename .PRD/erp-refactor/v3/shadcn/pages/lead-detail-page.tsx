"use client";

// Detail page for Lead
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLead, useUpdateLead } from "../hooks/lead.hooks.js";
import { LeadForm } from "../forms/lead-form.js";
import type { Lead } from "../types/lead.js";
import { Button } from "@/components/ui/button";

export function LeadDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLead(params.id);
  const updateMutation = useUpdateLead();

  const handleSubmit = (formData: Partial<Lead>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/lead") },
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
      <Button variant="ghost" onClick={() => router.push("/lead")}>← Back</Button>
      <LeadForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}