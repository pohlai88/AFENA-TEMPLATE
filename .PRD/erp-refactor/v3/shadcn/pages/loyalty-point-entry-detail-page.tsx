"use client";

// Detail page for Loyalty Point Entry
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLoyaltyPointEntry, useUpdateLoyaltyPointEntry } from "../hooks/loyalty-point-entry.hooks.js";
import { LoyaltyPointEntryForm } from "../forms/loyalty-point-entry-form.js";
import type { LoyaltyPointEntry } from "../types/loyalty-point-entry.js";
import { Button } from "@/components/ui/button";

export function LoyaltyPointEntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLoyaltyPointEntry(params.id);
  const updateMutation = useUpdateLoyaltyPointEntry();

  const handleSubmit = (formData: Partial<LoyaltyPointEntry>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/loyalty-point-entry") },
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
      <Button variant="ghost" onClick={() => router.push("/loyalty-point-entry")}>← Back</Button>
      <LoyaltyPointEntryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}