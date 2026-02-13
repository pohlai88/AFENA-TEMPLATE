"use client";

// Detail page for BOM Creator
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBomCreator, useUpdateBomCreator } from "../hooks/bom-creator.hooks.js";
import { BomCreatorForm } from "../forms/bom-creator-form.js";
import type { BomCreator } from "../types/bom-creator.js";
import { Button } from "@/components/ui/button";

export function BomCreatorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBomCreator(params.id);
  const updateMutation = useUpdateBomCreator();

  const handleSubmit = (formData: Partial<BomCreator>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom-creator") },
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
      <Button variant="ghost" onClick={() => router.push("/bom-creator")}>← Back</Button>
      <BomCreatorForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}