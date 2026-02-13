"use client";

// Detail page for Plant Floor
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePlantFloor, useUpdatePlantFloor } from "../hooks/plant-floor.hooks.js";
import { PlantFloorForm } from "../forms/plant-floor-form.js";
import type { PlantFloor } from "../types/plant-floor.js";
import { Button } from "@/components/ui/button";

export function PlantFloorDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePlantFloor(params.id);
  const updateMutation = useUpdatePlantFloor();

  const handleSubmit = (formData: Partial<PlantFloor>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/plant-floor") },
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
      <Button variant="ghost" onClick={() => router.push("/plant-floor")}>← Back</Button>
      <PlantFloorForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}