"use client";

// Detail page for Allowed Dimension
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAllowedDimension, useUpdateAllowedDimension } from "../hooks/allowed-dimension.hooks.js";
import { AllowedDimensionForm } from "../forms/allowed-dimension-form.js";
import type { AllowedDimension } from "../types/allowed-dimension.js";
import { Button } from "@/components/ui/button";

export function AllowedDimensionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAllowedDimension(params.id);
  const updateMutation = useUpdateAllowedDimension();

  const handleSubmit = (formData: Partial<AllowedDimension>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/allowed-dimension") },
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
      <Button variant="ghost" onClick={() => router.push("/allowed-dimension")}>← Back</Button>
      <AllowedDimensionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}