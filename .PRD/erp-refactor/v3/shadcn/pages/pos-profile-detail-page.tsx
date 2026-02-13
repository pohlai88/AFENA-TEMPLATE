"use client";

// Detail page for POS Profile
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosProfile, useUpdatePosProfile } from "../hooks/pos-profile.hooks.js";
import { PosProfileForm } from "../forms/pos-profile-form.js";
import type { PosProfile } from "../types/pos-profile.js";
import { Button } from "@/components/ui/button";

export function PosProfileDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosProfile(params.id);
  const updateMutation = useUpdatePosProfile();

  const handleSubmit = (formData: Partial<PosProfile>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-profile") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-profile")}>← Back</Button>
      <PosProfileForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}