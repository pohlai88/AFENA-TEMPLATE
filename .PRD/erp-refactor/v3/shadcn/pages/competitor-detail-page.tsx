"use client";

// Detail page for Competitor
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCompetitor, useUpdateCompetitor } from "../hooks/competitor.hooks.js";
import { CompetitorForm } from "../forms/competitor-form.js";
import type { Competitor } from "../types/competitor.js";
import { Button } from "@/components/ui/button";

export function CompetitorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCompetitor(params.id);
  const updateMutation = useUpdateCompetitor();

  const handleSubmit = (formData: Partial<Competitor>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/competitor") },
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
      <Button variant="ghost" onClick={() => router.push("/competitor")}>← Back</Button>
      <CompetitorForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}