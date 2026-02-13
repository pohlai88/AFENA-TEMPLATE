"use client";

// Detail page for Competitor Detail
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCompetitorDetail, useUpdateCompetitorDetail } from "../hooks/competitor-detail.hooks.js";
import { CompetitorDetailForm } from "../forms/competitor-detail-form.js";
import type { CompetitorDetail } from "../types/competitor-detail.js";
import { Button } from "@/components/ui/button";

export function CompetitorDetailDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCompetitorDetail(params.id);
  const updateMutation = useUpdateCompetitorDetail();

  const handleSubmit = (formData: Partial<CompetitorDetail>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/competitor-detail") },
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
      <Button variant="ghost" onClick={() => router.push("/competitor-detail")}>← Back</Button>
      <CompetitorDetailForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}