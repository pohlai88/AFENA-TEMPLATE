"use client";

// Detail page for Authorization Control
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAuthorizationControl, useUpdateAuthorizationControl } from "../hooks/authorization-control.hooks.js";
import { AuthorizationControlForm } from "../forms/authorization-control-form.js";
import type { AuthorizationControl } from "../types/authorization-control.js";
import { Button } from "@/components/ui/button";

export function AuthorizationControlDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAuthorizationControl(params.id);
  const updateMutation = useUpdateAuthorizationControl();

  const handleSubmit = (formData: Partial<AuthorizationControl>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/authorization-control") },
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
      <Button variant="ghost" onClick={() => router.push("/authorization-control")}>← Back</Button>
      <AuthorizationControlForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}