"use client";

// Detail page for Vehicle
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useVehicle, useUpdateVehicle } from "../hooks/vehicle.hooks.js";
import { VehicleForm } from "../forms/vehicle-form.js";
import type { Vehicle } from "../types/vehicle.js";
import { Button } from "@/components/ui/button";

export function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useVehicle(params.id);
  const updateMutation = useUpdateVehicle();

  const handleSubmit = (formData: Partial<Vehicle>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/vehicle") },
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
      <Button variant="ghost" onClick={() => router.push("/vehicle")}>← Back</Button>
      <VehicleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}