"use client";

// Detail page for Manufacturer
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useManufacturer, useUpdateManufacturer } from "../hooks/manufacturer.hooks.js";
import { ManufacturerForm } from "../forms/manufacturer-form.js";
import type { Manufacturer } from "../types/manufacturer.js";
import { Button } from "@/components/ui/button";

export function ManufacturerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useManufacturer(params.id);
  const updateMutation = useUpdateManufacturer();

  const handleSubmit = (formData: Partial<Manufacturer>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/manufacturer") },
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
      <Button variant="ghost" onClick={() => router.push("/manufacturer")}>← Back</Button>
      <ManufacturerForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}