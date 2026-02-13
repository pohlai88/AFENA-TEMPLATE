"use client";

// Detail page for Location
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLocation, useUpdateLocation } from "../hooks/location.hooks.js";
import { LocationForm } from "../forms/location-form.js";
import type { Location } from "../types/location.js";
import { Button } from "@/components/ui/button";

export function LocationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLocation(params.id);
  const updateMutation = useUpdateLocation();

  const handleSubmit = (formData: Partial<Location>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/location") },
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
      <Button variant="ghost" onClick={() => router.push("/location")}>← Back</Button>
      <LocationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}