"use client";

// Detail page for Prospect Lead
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProspectLead, useUpdateProspectLead } from "../hooks/prospect-lead.hooks.js";
import { ProspectLeadForm } from "../forms/prospect-lead-form.js";
import type { ProspectLead } from "../types/prospect-lead.js";
import { Button } from "@/components/ui/button";

export function ProspectLeadDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProspectLead(params.id);
  const updateMutation = useUpdateProspectLead();

  const handleSubmit = (formData: Partial<ProspectLead>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/prospect-lead") },
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
      <Button variant="ghost" onClick={() => router.push("/prospect-lead")}>← Back</Button>
      <ProspectLeadForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}