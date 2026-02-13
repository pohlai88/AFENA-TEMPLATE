"use client";

// Detail page for Portal User
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePortalUser, useUpdatePortalUser } from "../hooks/portal-user.hooks.js";
import { PortalUserForm } from "../forms/portal-user-form.js";
import type { PortalUser } from "../types/portal-user.js";
import { Button } from "@/components/ui/button";

export function PortalUserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePortalUser(params.id);
  const updateMutation = useUpdatePortalUser();

  const handleSubmit = (formData: Partial<PortalUser>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/portal-user") },
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
      <Button variant="ghost" onClick={() => router.push("/portal-user")}>← Back</Button>
      <PortalUserForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}