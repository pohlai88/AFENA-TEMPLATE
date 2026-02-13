"use client";

// Detail page for Loyalty Program
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLoyaltyProgram, useUpdateLoyaltyProgram } from "../hooks/loyalty-program.hooks.js";
import { LoyaltyProgramForm } from "../forms/loyalty-program-form.js";
import type { LoyaltyProgram } from "../types/loyalty-program.js";
import { Button } from "@/components/ui/button";

export function LoyaltyProgramDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLoyaltyProgram(params.id);
  const updateMutation = useUpdateLoyaltyProgram();

  const handleSubmit = (formData: Partial<LoyaltyProgram>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/loyalty-program") },
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
      <Button variant="ghost" onClick={() => router.push("/loyalty-program")}>← Back</Button>
      <LoyaltyProgramForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}