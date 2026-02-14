"use client";

// Detail page for Territory
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useTerritory, useUpdateTerritory } from "../hooks/territory.hooks.js";
import { TerritoryForm } from "../forms/territory-form.js";
import type { Territory } from "../types/territory.js";
import { Button } from "@/components/ui/button";

export function TerritoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useTerritory(params.id);
  const updateMutation = useUpdateTerritory();

  const handleSubmit = (formData: Partial<Territory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/territory") },
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
      <Button variant="ghost" onClick={() => router.push("/territory")}>← Back</Button>
      <TerritoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}