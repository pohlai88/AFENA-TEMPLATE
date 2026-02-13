"use client";

// Detail page for Plaid Settings
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePlaidSettings, useUpdatePlaidSettings } from "../hooks/plaid-settings.hooks.js";
import { PlaidSettingsForm } from "../forms/plaid-settings-form.js";
import type { PlaidSettings } from "../types/plaid-settings.js";
import { Button } from "@/components/ui/button";

export function PlaidSettingsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePlaidSettings(params.id);
  const updateMutation = useUpdatePlaidSettings();

  const handleSubmit = (formData: Partial<PlaidSettings>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/plaid-settings") },
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
      <Button variant="ghost" onClick={() => router.push("/plaid-settings")}>← Back</Button>
      <PlaidSettingsForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}