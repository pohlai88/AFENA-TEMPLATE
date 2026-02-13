"use client";

// Detail page for Loyalty Program Collection
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLoyaltyProgramCollection, useUpdateLoyaltyProgramCollection } from "../hooks/loyalty-program-collection.hooks.js";
import { LoyaltyProgramCollectionForm } from "../forms/loyalty-program-collection-form.js";
import type { LoyaltyProgramCollection } from "../types/loyalty-program-collection.js";
import { Button } from "@/components/ui/button";

export function LoyaltyProgramCollectionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLoyaltyProgramCollection(params.id);
  const updateMutation = useUpdateLoyaltyProgramCollection();

  const handleSubmit = (formData: Partial<LoyaltyProgramCollection>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/loyalty-program-collection") },
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
      <Button variant="ghost" onClick={() => router.push("/loyalty-program-collection")}>← Back</Button>
      <LoyaltyProgramCollectionForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}