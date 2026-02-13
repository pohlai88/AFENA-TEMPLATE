"use client";

// Detail page for POS Profile User
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePosProfileUser, useUpdatePosProfileUser } from "../hooks/pos-profile-user.hooks.js";
import { PosProfileUserForm } from "../forms/pos-profile-user-form.js";
import type { PosProfileUser } from "../types/pos-profile-user.js";
import { Button } from "@/components/ui/button";

export function PosProfileUserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePosProfileUser(params.id);
  const updateMutation = useUpdatePosProfileUser();

  const handleSubmit = (formData: Partial<PosProfileUser>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/pos-profile-user") },
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
      <Button variant="ghost" onClick={() => router.push("/pos-profile-user")}>← Back</Button>
      <PosProfileUserForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}