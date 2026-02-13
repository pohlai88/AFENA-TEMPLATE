"use client";

// Detail page for Linked Location
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLinkedLocation, useUpdateLinkedLocation } from "../hooks/linked-location.hooks.js";
import { LinkedLocationForm } from "../forms/linked-location-form.js";
import type { LinkedLocation } from "../types/linked-location.js";
import { Button } from "@/components/ui/button";

export function LinkedLocationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLinkedLocation(params.id);
  const updateMutation = useUpdateLinkedLocation();

  const handleSubmit = (formData: Partial<LinkedLocation>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/linked-location") },
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
      <Button variant="ghost" onClick={() => router.push("/linked-location")}>← Back</Button>
      <LinkedLocationForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}