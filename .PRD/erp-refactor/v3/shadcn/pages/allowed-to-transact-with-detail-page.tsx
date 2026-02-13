"use client";

// Detail page for Allowed To Transact With
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAllowedToTransactWith, useUpdateAllowedToTransactWith } from "../hooks/allowed-to-transact-with.hooks.js";
import { AllowedToTransactWithForm } from "../forms/allowed-to-transact-with-form.js";
import type { AllowedToTransactWith } from "../types/allowed-to-transact-with.js";
import { Button } from "@/components/ui/button";

export function AllowedToTransactWithDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAllowedToTransactWith(params.id);
  const updateMutation = useUpdateAllowedToTransactWith();

  const handleSubmit = (formData: Partial<AllowedToTransactWith>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/allowed-to-transact-with") },
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
      <Button variant="ghost" onClick={() => router.push("/allowed-to-transact-with")}>← Back</Button>
      <AllowedToTransactWithForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}